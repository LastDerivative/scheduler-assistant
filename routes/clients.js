const express = require('express');
const router = express.Router();
const { Client } = require('../models/model');  // Import the Client model

// Create a new client
router.post('/new', async (req, res) => {
    try {
        const newClient = new Client(req.body);
        await newClient.save();
        res.status(201).send(newClient);
    } catch (err) {
        if (err.code === 11000) {  // Duplicate key error
            res.status(400).send({ error: 'Client already exists' });
        } else {
            res.status(400).send({ error: err.message });
        }
    }
});

/*
Testing:
    http://localhost:3000/clients/new
    {
    "organization": "GusCoffe Inc",
    "email": "coffee@example.com",
    "phoneNumber": "123-1245-1234"
    }
should create new client with above info

Response:
    {
        "organization": "GusCoffe Inc",
        "email": "coffee@example.com",
        "phoneNumber": "123-1245-1234",
        "active": true,
        "_id": "66c38bd3d23961b69af90b46",
        "__v": 0
    }

    TODO: Create a human readble ID and respond with a "success" message
*/



// Get all clients
router.get('/', async (req, res) => {
    try {
        const clients = await Client.find();
        res.send(clients);
    } catch (err) {
        res.status(500).send({ error: err.message });
    }
});

// Get a client by ID
router.get('/:id', async (req, res) => {
    try {
        const client = await Client.findById(req.params.id);
        if (!client) {
            return res.status(404).send({ error: 'Client not found' });
        }
        res.send(client);
    } catch (err) {
        res.status(500).send({ error: err.message });
    }
});

// Update a client by ID
router.put('/:id', async (req, res) => {
    try {
        const client = await Client.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!client) {
            return res.status(404).send({ error: 'Client not found' });
        }
        res.send(client);
    } catch (err) {
        res.status(400).send({ error: err.message });
    }
});

// Delete a client by ID
router.delete('/:id', async (req, res) => {
    try {
        const client = await Client.findByIdAndDelete(req.params.id);
        if (!client) {
            return res.status(404).send({ error: 'Client not found' });
        }
        res.send(client);
    } catch (err) {
        res.status(500).send({ error: err.message });
    }
});

module.exports = router;
