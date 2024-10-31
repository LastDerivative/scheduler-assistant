const express = require('express');
const router = express.Router();
const { EmployeeRequest, Employee } = require('../models/model');  // Importing the EmployeeRequest model

// Create a new employee request
router.post('/new', async (req, res) => {
    try {
        const { employeeID, requestType, timeOffStart, timeOffEnd, shiftToTradeID, desiredShiftID, status, submitDate } = req.body;

        // If time-off is provided, check for overlapping requests
        if (timeOffStart && timeOffEnd) {
            if (timeOffStart >= timeOffEnd) {
                return res.status(400).send({ error: 'Invalid time-off range provided' });
            }

            if (new Date(timeOffStart) < new Date()) {
                return res.status(400).send({ error: 'Time-off requests cannot be made retroactively' });
            }

            const overlappingReq = await EmployeeRequest.findOne({
                employeeID: employeeID, //looking at requests that only the supplied user ID
                $or: [ // will return true if any of the following apply
                    { timeOffStart: { $lt: timeOffEnd, $gte: timeOffStart } }, // Overlaps with the new request's timeOffStart
                    { timeOffEnd: { $gt: timeOffStart, $lte: timeOffEnd } }    // Overlaps with the new request's timeOffEnd
                ]
            });

            const encasingReq = await EmployeeRequest.findOne({
                employeeID: employeeID, //looking at requests that only the supplied user ID
                $and: [ // will return true if timeOffStart and timeOffEnd occur outside of the specified frame (new request placed within an existing one)
                    { timeOffStart: { $lte: timeOffStart } },
                    { timeOffEnd: { $gte: timeOffEnd } }
                ]
            })

            if (overlappingReq || encasingReq) {
                return res.status(400).send({ error: 'Time-off overlaps with an existing request for this employee' });
            }
        }

        if (shiftToTradeID || desiredShiftID) {
            const duplicateReq = await EmployeeRequest.findOne({
                employeeID: employeeID, //looking at requests that only the supplied user ID
                requestType: requestType,
                $or: [
                    { shiftToTradeID: shiftToTradeID },
                    { desiredShiftID: desiredShiftID }
                ]
            });

            if (duplicateReq) {
                return res.status(400).send({ error: 'Duplicate shift trade request' });
            }
        }

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
    http://localhost:3000/employeeRequests/new
    {
    "employeeID": "6700552b63dc479a35f9ea76",
    "requestType": "Time-off",
    "timeOffStart": "2024-10-17T15:55:00Z",
    "timeOffEnd": "2024-10-17T16:00:00Z",
    "submitDate": "2024-10-19T16:00:00Z"
    }

    http://localhost:3000/employeeRequests/new
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

        // Find the current request document to compare values
        const existingEmployeeRequest = await EmployeeRequest.findById(employeeRequestID);
        if (!existingEmployeeRequest) {
            return res.status(404).send({ error: 'Employee request not found' });
        }

        // Check for overlapping requests for either employeeRequestID if provided?

        // If employeeID is provided or being updated, check for overlapping requests
        if (updateData.employeeID || updateData.timeOffStart || updateData.timeOffEnd) {
            const employeeID = updateData.employeeID || existingEmployeeRequest.employeeID;// new ID or current
            const newStartTime = updateData.timeOffStart ? new Date(updateData.timeOffStart) : existingEmployeeRequest.timeOffStart;
            const newEndTime = updateData.timeOffEnd ? new Date(updateData.timeOffEnd) : existingEmployeeRequest.timeOffEnd;
            
            if (newStartTime >= newEndTime) {
                return res.status(400).send({ error: 'Invalid time-off range provided' });
            }

            if (new Date(newStartTime) < new Date()) {
                return res.status(400).send({ error: 'Time-off requests cannot be made retroactively' });
            }

            const overlappingReq = await EmployeeRequest.findOne({
                _id: { $ne: employeeRequestID },  // Exclude the current request being updated
                employeeID: employeeID, //looking at requests that only the supplied user ID
                $or: [ // will return true if any of the following apply
                    { timeOffStart: { $lt: newEndTime, $gte: newStartTime } }, // Overlaps with the new request's timeOffStart
                    { timeOffEnd: { $gt: newStartTime, $lte: newEndTime } }    // Overlaps with the new request's timeOffEnd
                ]
            });

            const encasingReq = await EmployeeRequest.findOne({
                _id: { $ne: employeeRequestID },  // Exclude the current request being updated
                employeeID: employeeID, //looking at requests that only the supplied user ID
                $and: [ // will return true if timeOffStart and timeOffEnd occur outside of the specified frame (new request placed within an existing one)
                    { timeOffStart: { $lte: newStartTime } },
                    { timeOffEnd: { $gte: newEndTime } }
                ]
            })

            if (overlappingReq || encasingReq) {
                return res.status(400).send({ error: 'Time-off overlaps with an existing request for this employee' });
            }
            
        }
        
        if (shiftToTradeID || desiredShiftID) {
            const duplicateReq = await EmployeeRequest.findOne({
                _id: { $ne: employeeRequestID },  // Exclude the current request being updated
                employeeID: employeeID, //looking at requests that only the supplied user ID
                requestType: requestType,
                $or: [
                    { shiftToTradeID: shiftToTradeID },
                    { desiredShiftID: desiredShiftID }
                ]
            });

            if (duplicateReq) {
                return res.status(400).send({ error: 'Duplicate shift trade request' });
            }
        }

        // Update the request in the database
        const updatedEmployeeRequest = await EmployeeRequest.findByIdAndUpdate(employeeRequestID, updateData, { new: true, runValidators: true });
        if (!updatedEmployeeRequest) {
            return res.status(404).send({ error: 'Employee request not found' });
        }

        res.send(updatedEmployeeRequest);
    } catch (err) {
        res.status(400).send({ error: err.message });
    }
});

// Delete a request by ID
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
