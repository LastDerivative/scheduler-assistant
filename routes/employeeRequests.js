const express = require('express');
const router = express.Router();
const { EmployeeRequest, Employee } = require('../models/model');  // Importing the EmployeeRequest model

// Create a new employee request
router.post('/new', async (req, res) => {
    try {
        const { employeeID, requestType, timeOffStart, timeOffEnd, shiftToTradeID, desiredShiftID, status, submitDate } = req.body;

        // Create the new employee request
        const newEmployeeRequest = new EmployeeRequest({ employeeID, requestType, timeOffStart, timeOffEnd, shiftToTradeID, desiredShiftID, status, submitDate });

        // Save the new employee request to the database
        await newEmployeeRequest.save();

        // Send the created employee request as a response with status 201 (Created)
        res.status(201).send(newEmployeeRequest);
    } catch (err) {
        // Send an error response with status 400 (Bad Request) if something goes wrong
        res.status(400).send({ error: err.message });
    }
});

/*
Testing:
    http://localhost:3000/shifts/new
    {
    "employeeID": "6700552b63dc479a35f9ea76",
    "requestType": "Time-off",
    "timeOffStart": "2024-10-17T15:55:00Z",
    "timeOffEnd": "2024-10-17T16:00:00Z",
    "submitDate": "2024-10-19T16:00:00Z"
    }

    http://localhost:3000/shifts/new
    {
    "employeeID": "6700552b63dc479a35f9ea76",
    "requestType": "Shift trade",
    "shiftToTradeID": "67116d16692d5a4b00678d7d",
    "submitDate": "2024-10-19T16:00:00Z"
    }
*/

// Get all employee request
router.get('/', async (req, res) => {
    try {
        // Query the database to get all employee requests
        const employeeRequests = await EmployeeRequest.find().populate('employeeID').populate('requestType');
        // Send the employee requests as the response
        res.send(employeeRequests);
    } catch (err) {
        // Handle any errors
        res.status(500).send({ error: err.message });
    }
});

// Get an employeeRequest by ID
router.get('/:id', async (req, res) => {
    try {
        const employeeRequest = await EmployeeRequest.findById(req.params.id);
        if (!employeeRequest) {
            return res.status(404).send({ error: 'Employee request not found' });
        }
        res.send(employeeRequest);
    } catch (err) {
        res.status(500).send({ error: err.message });
    }
});

// Update an employee request by ID
router.put('/:id', async (req, res) => {
    try {
        const employeeRequestID = req.params.id;
        const updateData = req.body;

        // Find the current shift document to compare values
        const existingEmployeeRequest = await EmployeeRequest.findById(employeeRequestID);
        if (!existingEmployeeRequest) {
            return res.status(404).send({ error: 'Employee request not found' });
        }

        // Check for overlapping shifts for either shiftID if provided?

        // Update the shift in the database
        const updatedEmployeeRequest = await EmployeeRequest.findByIdAndUpdate(employeeRequestID, updateData, { new: true, runValidators: true });
        if (!updatedEmployeeRequest) {
            return res.status(404).send({ error: 'Employee request not found' });
        }

        res.send(updatedEmployeeRequest);
    } catch (err) {
        res.status(400).send({ error: err.message });
    }
});

// Delete a shift by ID
router.delete('/:id', async (req, res) => {
    try {
        const employeeRequest = await EmployeeRequest.findByIdAndDelete(req.params.id);
        if (!employeeRequest) {
            return res.status(404).send({ error: 'Employee request not found' });
        }
        res.send(employeeRequest);
    } catch (err) {
        res.status(500).send({ error: err.message });
    }
});



module.exports = router;
