const express = require('express');
const router = express.Router();
const { Organization } = require('../models/model');  // Import the Organization model

// Create a new organization
// Should be processed along with creation of a new manager without a preexisitng organization
router.post('/new', async (req, res) => {
    try {
        const newOrganization = new Organization(req.body);
        await newOrganization.save();
        res.status(201).send(newOrganization);
    } catch (err) {
        if (err.code === 11000) {  // Duplicate key error
            res.status(400).send({ error: 'Organization already exists' });
        } else {
            res.status(400).send({ error: err.message });
        }
    }
});

/*
Testing:
    http://localhost:3000/organizations/new
    {
    "orgName": "GusCoffe Inc",
    "orgEmail": "coffee@example.com",
    "establishDate": "05/04/1996",
    "orgPhone": "123-1245-1234"
    }
should create new organization with above info

Response:
    {
        "orgName": "GusCoffe Inc",
        "orgEmail": "coffee@example.com",
        "establishDate": "1996-05-04T07:00:00.000Z",
        "orgPhone": "123-1245-1234",
        "_id": "670acb80e2ac74f3ee20415b",
        "__v": 0
    }

    TODO: Create a human readble ID and respond with a "success" message
*/



// Get all organizations
router.get('/', async (req, res) => {
    try {
        const organization = await Organization.find();
        res.send(organization);
    } catch (err) {
        res.status(500).send({ error: err.message });
    }
});

// Get an organization by ID
router.get('/:id', async (req, res) => {
    try {
        const organization = await Organization.findById(req.params.id);
        if (!organization) {
            return res.status(404).send({ error: 'Organization not found' });
        }
        res.send(organization);
    } catch (err) {
        res.status(500).send({ error: err.message });
    }
});

// Update an organization by ID
router.put('/:id', async (req, res) => {
    try {
        const organization = await Organization.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!organization) {
            return res.status(404).send({ error: 'Organization not found' });
        }
        res.send(organization);
    } catch (err) {
        res.status(400).send({ error: err.message });
    }
});

// Delete an organization by ID
router.delete('/:id', async (req, res) => {
    try {
        const organization = await Organization.findByIdAndDelete(req.params.id);
        if (!organization) {
            return res.status(404).send({ error: 'Organization not found' });
        }
        res.send(organization);
    } catch (err) {
        res.status(500).send({ error: err.message });
    }
});

module.exports = router;
