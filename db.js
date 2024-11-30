require('dotenv').config(); // Load environment variables
// Importing the mongoose library to interact with MongoDB
const mongoose = require('mongoose');

// MongoDB connection string
//const uri = 'mongodb://localhost:27017/scheduler'; // For Local
const uri = process.env.MONGODB_URI;


// Establishing connection to the MongoDB server using uri
//mongoose.connect(uri); // For Local

// Establishing connection to MongoDB Atlas using uri
mongoose.connect(uri, {
    serverApi: {
      version: '1', // Stable API version
      strict: true,
      deprecationErrors: true,
    }
  });

// Stored connection
const db = mongoose.connection;

// Set event listener to handle connection errors
db.on('error', console.error.bind(console, 'connection error:'));

// Set event listener to run once, when the connection is opened correctly
db.once('open', () => {
    //console.log('Connected to MongoDB'); // Logs message to console // For Local
    console.log('Connected to MongoDB Atlas');
});

// Exporting the mongoose object to be used in other parts of the application
module.exports = mongoose;
