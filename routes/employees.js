const express = require('express');
const router = express.Router();
const { Employee } = require('../models/model');  // Importing the Employee model

// Create a new employee
router.post('/new_e', async (req, res) => { //req holds request from sender
    //req.body populated by middleware -> express.json() in index
    try {
        const newEmployee = new Employee(req.body);
        await newEmployee.save();
        res.status(201).send(newEmployee);//sets response code to inform sender
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
