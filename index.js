//Importing Express library to create the web server
const express = require('express');
//Create instance of Express app
const app = express();
//Importing the mongoose connection from the db module
//Used to establish the MongoDB connection
const mongoose = require('./db');

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