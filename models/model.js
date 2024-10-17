const mongoose = require('../db');
const bcrypt = require('bcryptjs');  // For hashing passwords

// Expanded Employee Schema
const employeeSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    //hireDate: { type: Date, default: Date.now },
    //position: { type: String },
    orgID: { type: mongoose.Schema.Types.ObjectId, ref: 'Organization', required: true },
    managerStatus: { type: Boolean, default: false },   // Boolean for whether or not employee is a manager
    manager: { type: String, required: false },  // The employee's manager (managers may supervise themselves?)
    password: { type: String, required: true }  // Added field for password
});

// Pre-save hook to hash password before saving it in the database
employeeSchema.pre('save', async function (next) {
    try {
        if (!this.isModified('password')) return next(); // Only hash if the password is new or modified
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);  // Hash the password
        next();
    } catch (err) {
        next(err);
    }
});

// Method to compare a given password with the hashed password stored in the database
employeeSchema.methods.comparePassword = async function (candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};
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

// Organization Schema
// Organization is needed to have a site ex: Site A which holds Shifts for Employees
const organizationSchema = new mongoose.Schema({
    orgName: { type: String, required: true },
    orgEmail: { type: String, required: true },
    establishDate: { type: Date, required: true },
    orgPhone: { type: String, required: true }
});

/* Removal of Job schema in favor of unrestricted shift names

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
*/

// Site Schema
// Site is tied to an organization
const siteSchema = new mongoose.Schema({
    siteName: { type: String, required: true },
    orgID: { type: mongoose.Schema.Types.ObjectId, ref: 'Organization', required: true },
    address: { type: String, required: true }
});

// Shift Schema
// Shift is tied to a site and does not need an employee to be created as it can be filled later
const shiftSchema = new mongoose.Schema({
    shiftName: { type: String, required: true },
    employeeID: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee', required: false },  // Employee assignment is optional
    startTime: { type: Date, required: true },  // Shift start time
    endTime: { type: Date, required: true },  // Shift end time
    punchIn: { type: Date, default: null },  // Shift start time
    punchOut: { type: Date, default: null },  // Shift end time
    siteID: { type: mongoose.Schema.Types.ObjectId, ref: 'Site', required: true }

    /* Duration can be calculated in the backend while processing requests for display on the frontend. Alternatively, can implement as a derived attribute
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
    */
    //status: { type: String, enum: ['Filled', 'Not Filled'], default: 'Not Filled' },  // Automatically set based on employeeId
    //jobId: { type: mongoose.Schema.Types.ObjectId, ref: 'Job', required: true }  // Reference to the job
});

/* May use manual entry of endTime and removal of status attribute

// Pre-save middleware to calculate endTime and set status
// Need to account for 30 minute break, or assume a paid break for all shifts
shiftSchema.pre('save', function(next) {
    // Calculate the endTime based on startTime and duration
    this.endTime = new Date(this.startTime.getTime() + this.duration * 60 * 60 * 1000);  // Convert hours to milliseconds

    // Set the status based on whether an employee is assigned
    this.status = this.employeeId ? 'Filled' : 'Not Filled';

    next();
});
*/

shiftSchema.post('save', function(doc) {//runs after document has been saved
    console.log('A shift was saved:', doc);
});

shiftSchema.index({ startTime: 1 }); // may help with speed if indexing on time //will it cause issues for the same time?

// Model Creation
const Employee = mongoose.model('Employee', employeeSchema);
const Organization = mongoose.model('Organization', organizationSchema);
const Site = mongoose.model('Site', siteSchema);
const Shift = mongoose.model('Shift', shiftSchema);

module.exports = { Employee, Organization, Site, Shift };
