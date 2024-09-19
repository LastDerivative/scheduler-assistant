# Automatic Scheduler and Man-Hour Tracker

Dependencies:

Node.js, npm, MongoDB, mongoose, bcryptjs

## Setup

Node.js/npm

- Install from [here](https://nodejs.org/en) (also installs npm).
- Confirm installation by running 'node -v' and 'npm -v'.

MongoDB (and Compass)

- Install from [here](https://www.mongodb.com/try/download/community)
- As of early development stages, do **not** run as a Service.
- Installer should also include Compass for a visual interface.
- Run 'mongod' in terminal (PC) to startup the database or,
- 'sudo systemctl start mongod', 'sudo systemctl enable mongod', 'sudo systemctl status mongod' (Linux).
- Attempt to connect to the server on Compass at localhost:27017 to ensure it is running.

Directory Setup

- Open a terminal in the project directory.
- Run 'npm init -y' to start the project.
- Run 'npm install express mongoose' to allow database connection.

Run (EARLY DEVELOPMENT)

- Run the backend in VScode with 'node index.js'.
- Should output 'Connected to MongoDB' if the server is running.
- Connect on a web-browser at localhost:3000.
