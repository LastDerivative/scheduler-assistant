const express = require('express');
const router = express.Router();
const { Site } = require('../models/model');  // Import the Site model

// Create a new site
router.post('/new', async (req, res) => {
    try {
        const newSite = new Site(req.body);
        await newSite.save();
        res.status(201).send(newSite);
    } catch (err) {
        if (err.code === 11000) {  // Duplicate key error
            res.status(400).send({ error: 'Site name must be unique for each organization' });
        } else {
            res.status(400).send({ error: err.message });
        }
    }
});
/*
Testing:
    http://localhost:3000/sites/new
    {
    "siteName": "OC Store",
    "orgID": "66c38dd9d23961b69af90b4d"
    }
should create new organization with above info

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

// Get all sites
router.get('/', async (req, res) => {
    try {
        const sites = await Site.find().populate('orgID');  // Populate organization details
        res.send(sites);
    } catch (err) {
        res.status(500).send({ error: err.message });
    }
});

// Get a site by ID
router.get('/:id', async (req, res) => {
    try {
        const site = await Site.findById(req.params.id).populate('orgID');
        if (!site) {
            return res.status(404).send({ error: 'Site not found' });
        }
        res.send(site);
    } catch (err) {
        res.status(500).send({ error: err.message });
    }
});

// Update a site by ID
router.put('/:id', async (req, res) => {
    try {
        const site = await Site.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!site) {
            return res.status(404).send({ error: 'Site not found' });
        }
        res.send(site);
    } catch (err) {
        res.status(400).send({ error: err.message });
    }
});

// Delete a site by ID
router.delete('/:id', async (req, res) => {
    try {
        const site = await Site.findByIdAndDelete(req.params.id);
        if (!site) {
            return res.status(404).send({ error: 'Site not found' });
        }
        res.send(site);
    } catch (err) {
        res.status(500).send({ error: err.message });
    }
});

module.exports = router;
