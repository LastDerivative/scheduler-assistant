const express = require('express');
const jwt = require('jsonwebtoken'); //used for tokens
const router = express.Router();
const { Employee } = require('../models/model');  // Importing the Employee model

const JWT_SECRET = 'testingthistoken'; // Test secret, replace with secure key in production

// Register Route
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

// Login route 
router.post('/login', async (req, res) => { 
    // Get email and password from req body 
    const { email, password } = req.body; 
    try { 
      // Check if email exists 
      const employee = await Employee.findOne({ email }); 

      if (!employee) { 
        return res.status(400).send({ error: 'Invalid email or password' }); 
      } 

      // Compare the password with the hashed password 
      const isMatch = await employee.comparePassword(password); 
      if (!isMatch) { 
        return res.status(400).send({ error: 'Invalid email or password' }); 
      } 

      // Generate a JWT token with temp secret to be used across app for one hour
      const token = jwt.sign({ id: employee._id }, JWT_SECRET, { expiresIn: '1h' }); 

      // Send the token to the organization and EmployeeId
      res.status(200).send({ employeeId: employee._id, token }); 

    
    } catch (err) { 
      res.status(500).send({error: 'Server error during login' });
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
// TODO: Update to not return password hash
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
