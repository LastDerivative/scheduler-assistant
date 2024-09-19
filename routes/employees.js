const express = require('express');
const router = express.Router();
const { Employee } = require('../models/model');  // Importing the Employee model

/*
// Create a new employee
router.post('/new', async (req, res) => { //req holds request from sender
    //req.body populated by middleware -> express.json() in index
    try {
        const newEmployee = new Employee(req.body);
        await newEmployee.save();
        res.status(201).send(newEmployee);//sets response code to inform sender
    } catch (err) {
        res.status(400).send({ error: err.message });
    }
});

{
    "name": "Gus Test",
    "email": "testing@example.com",
    "active": true,
    "_id": "66c4fc5edaefa7f6a2042945",
    "__v": 0
}
*/
// TO DO: add an option to check for a current email?
// Employee registration route
router.post('/register', async (req, res) => { //req holds request from sender
    try {
        // Create a new employee from the request body
        const newEmployee = new Employee(req.body);
        
        // Save the employee, and the password will be hashed automatically by the pre-save hook
        await newEmployee.save();
        
        // Send the newly created employee object back (without password for security)
        const { password, ...employeeWithoutPassword } = newEmployee.toObject(); // Exclude password in response
        
        res.status(201).send({
            message: 'Employee registered successfully',  // Success message
            employee: employeeWithoutPassword              // Employee data without password
        });
    } catch (err) {
        res.status(400).send({ error: err.message });
    }
});

// Get all employees
router.get('/all', async (req, res) => {
    try {
        const employees = await Employee.find();
        res.send(employees);
    } catch (err) {
        res.status(500).send({ error: err.message });
    }
});

// Get an employee by ID
router.get('/:id', async (req, res) => {
    try {
        const employee = await Employee.findById(req.params.id);
        if (!employee) {
            return res.status(404).send({ error: 'Employee not found' });
        }
        res.send(employee);
    } catch (err) {
        res.status(500).send({ error: err.message });
    }
});

// Update an employee by ID
router.put('/:id', async (req, res) => {
    try {
        //new true -> returns updated info AND runValidators confirms that udpates adhere to schema
        const employee = await Employee.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!employee) {
            return res.status(404).send({ error: 'Employee not found' });
        }
        res.send(employee);
    } catch (err) {
        res.status(400).send({ error: err.message });
    }
});

// Delete an employee by ID
router.delete('/:id', async (req, res) => {
    try {
        const employee = await Employee.findByIdAndDelete(req.params.id);
        if (!employee) {
            return res.status(404).send({ error: 'Employee not found' });
        }
        res.send(employee);
    } catch (err) {
        res.status(500).send({ error: err.message });
    }
});

module.exports = router;
