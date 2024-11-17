// Importing Express library to create the web server
const express = require('express');
// Create instance of Express app
const app = express();
// Importing the mongoose connection from the db module
// Used to establish the MongoDB connection
const mongoose = require('./db');
const path = require('path');

const employeeRoutes = require('./routes/employees');  // Importing employee routes
const shiftRoutes = require('./routes/shifts');  // Importing shift routes
const siteRoutes = require('./routes/sites'); // Importing sites routes
const organizationRoutes = require('./routes/organizations'); // Importing organizations routes
const employeeRequestRoutes = require('./routes/employeeRequests');  // Importing employeeRequest routes

app.use(express.json());  // Middleware to parse JSON requests

// Connecting routes to Express application
app.use('/employees', employeeRoutes);  // Mount the employee routes
app.use('/shifts', shiftRoutes);  // Mount the shift routes
app.use('/sites', siteRoutes);
app.use('/organizations', organizationRoutes);
app.use('/employeeRequests', employeeRequestRoutes);

// Serve static files from the `dist` folder
app.use(express.static(path.join(__dirname, 'client/dist')));

// Catch-all route for serving the front-end app
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// Basic route to test the server (optional, can be removed)
app.get('/api', (req, res) => {
  res.send('Scheduler Assistant Backend'); // Response message
});

// Sets port number for server depending on below OR
const PORT = process.env.PORT || 3000;

// Start the server and listen for requests on the specified port
app.listen(PORT, () => {
  console.log(`Server is running on port http://localhost:${PORT}`);
});