//Importing Express library to create the web server
const express = require('express');
//Create instance of Express app
const app = express();
//Importing the mongoose connection from the db module
//Used to establish the MongoDB connection
const mongoose = require('./db');
const employeeRoutes = require('./routes/employees');  // Importing employee routes
const shiftRoutes = require('./routes/shifts');  // Importing shift routes
const siteRoutes = require('./routes/sites'); // Importing sites routes
const organizationRoutes = require('./routes/organizations'); // Importing organizations routes

app.use(express.json());  // Middleware to parse JSON requests

//connecting routes to Express application.
app.use('/employees', employeeRoutes);  // Mount the employee routes
app.use('/shifts', shiftRoutes);  // Mount the shift routes
app.use('/sites', siteRoutes);
app.use('/organizations', organizationRoutes);


// Basic route to test the server
app.get('/', (req, res) => {
  res.send('Scheduler Assistant Backend');//response message
});

//Sets port number for server depending on below OR
const PORT = process.env.PORT || 3000;

//Start the server and listen for requests on the specified port
app.listen(PORT, () => {
  console.log(`Server is running on port http://localhost:${PORT}`);
});