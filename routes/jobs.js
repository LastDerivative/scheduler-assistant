const express = require('express');
const router = express.Router();
const { Job } = require('../models/model');  // Import the Job model

// Create a new job
router.post('/new', async (req, res) => {
    try {
        const newJob = new Job(req.body);
        await newJob.save();
        res.status(201).send(newJob);
    } catch (err) {
        if (err.code === 11000) {  // Duplicate key error
            res.status(400).send({ error: 'Job name must be unique for each client' });
        } else {
            res.status(400).send({ error: err.message });
        }
    }
});
/*
Testing:
    http://localhost:3000/jobs/new
    {
    "jobName": "OC Store",
    "clientId": "66c38dd9d23961b69af90b4d"
    }
should create new client with above info

Response:
    {
        "organization": "GusCoffe Inc",
        "email": "coffee@example.com",
        "phoneNumber": "123-1245-1234",
        "active": true,
        "_id": "66c38dd9d23961b69af90b4d",
        "__v": 0
    }

    TODO: Create a human readble ID and respond with a "success" message
*/

// Get all jobs
router.get('/', async (req, res) => {
    try {
        const jobs = await Job.find().populate('clientId');  // Populate client details
        res.send(jobs);
    } catch (err) {
        res.status(500).send({ error: err.message });
    }
});

// Get a job by ID
router.get('/:id', async (req, res) => {
    try {
        const job = await Job.findById(req.params.id).populate('clientId');
        if (!job) {
            return res.status(404).send({ error: 'Job not found' });
        }
        res.send(job);
    } catch (err) {
        res.status(500).send({ error: err.message });
    }
});

// Update a job by ID
router.put('/:id', async (req, res) => {
    try {
        const job = await Job.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!job) {
            return res.status(404).send({ error: 'Job not found' });
        }
        res.send(job);
    } catch (err) {
        res.status(400).send({ error: err.message });
    }
});

// Delete a job by ID
router.delete('/:id', async (req, res) => {
    try {
        const job = await Job.findByIdAndDelete(req.params.id);
        if (!job) {
            return res.status(404).send({ error: 'Job not found' });
        }
        res.send(job);
    } catch (err) {
        res.status(500).send({ error: err.message });
    }
});

module.exports = router;
