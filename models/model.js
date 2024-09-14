const mongoose = require('../db');

// Expanded Employee Schema
const employeeSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    department: { type: String },
    //hireDate: { type: Date, default: Date.now },
    //position: { type: String },
    phoneNumber: { type: String },
    active: { type: Boolean, default: true }
});

employeeSchema.virtual('fullName').get(function() {
    return this.name;  // Assuming name is a single field
});

employeeSchema.methods.getFullName = function() {
    return this.name;
};

employeeSchema.statics.findByEmail = function(email) {
    return this.findOne({ email });
};

employeeSchema.index({ email: 1 });

// Client Schema
// Client is needed to create a job ex: Mcdonalds
const clientSchema = new mongoose.Schema({
    organization: { type: String, required: true, unique: true },
    email: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    active: { type: Boolean, default: true }
});

// Job Schema
// A client is linked to jobs ex: Mcdonalds has a number of restaurants, each of which would be a job
// A client can only have unique job names, but different clients can have the same job name
const jobSchema = new mongoose.Schema({
    jobName: { type: String, required: true },
    department: { type: String },
    phoneNumber: { type: String },
    active: { type: Boolean, default: true },
    clientId: { type: mongoose.Schema.Types.ObjectId, ref: 'Client', required: true },  // Reference to Client
    startDate: { type: Date, default: Date.now }
});

// Compound Index to ensure jobName is unique per client
jobSchema.index({ jobName: 1, clientId: 1 }, { unique: true });

// Shift Schema
// Shift is tied to a job and doest not need an employee to be created as it can be filled later
const shiftSchema = new mongoose.Schema({
    employeeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee', required: false },  // Employee assignment is optional
    startTime: { type: Date, required: true },  // Shift start time
    duration: { 
        type: Number, 
        required: true, 
        validate: {
            validator: function(value) {
                return value === 4 || value === 8;
            },
            message: 'Duration must be either 4 or 8 hours'
        }
    },  // Duration in hours, only allowing 4 or 8
    location: { type: String },
    role: { type: String },
    status: { type: String, enum: ['Filled', 'Not Filled'], default: 'Not Filled' },  // Automatically set based on employeeId
    jobId: { type: mongoose.Schema.Types.ObjectId, ref: 'Job', required: true }  // Reference to the job
});

// Pre-save middleware to calculate endTime and set status
// Need to account for 30 minute break, or assume a paid break for all shifts
shiftSchema.pre('save', function(next) {
    // Calculate the endTime based on startTime and duration
    this.endTime = new Date(this.startTime.getTime() + this.duration * 60 * 60 * 1000);  // Convert hours to milliseconds

    // Set the status based on whether an employee is assigned
    this.status = this.employeeId ? 'Filled' : 'Not Filled';

    next();
});

shiftSchema.post('save', function(doc) {//runs after document has been saved
    console.log('A shift was saved:', doc);
});

shiftSchema.index({ startTime: 1 }); // may help with speed if indexing on time //will it cause issues for the same time?

// Model Creation
const Employee = mongoose.model('Employee', employeeSchema);
const Client = mongoose.model('Client', clientSchema);
const Job = mongoose.model('Job', jobSchema);
const Shift = mongoose.model('Shift', shiftSchema);

module.exports = { Employee, Client, Job, Shift };
