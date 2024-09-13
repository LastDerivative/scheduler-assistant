//Importing the mongoose library to interact with MongoDB
const mongoose = require('mongoose');

//MongoDB connection string
const uri = 'mongodb://localhost:27017/scheduler';

//Establishing connection to the MongoDB server using uri
mongoose.connect(uri);

//Stored connection
const db = mongoose.connection;

//Set event listener to handle connection errors
db.on('error', console.error.bind(console, 'connection error:'));

//Set event listener to run once, when the connection is opened correctly
db.once('open', () => {
    console.log('Connected to MongoDB'); //logs message to console
});

//Exporting the mongoose object to be used in other parts of the application
module.exports = mongoose;
