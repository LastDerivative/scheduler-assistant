const jwt = require('jsonwebtoken');
const JWT_SECRET = 'testingthistoken'; // Test secret, replace with secure key in production
const REFRESH_TOKEN_SECRET = 'REFRESH_TOKEN_SECRET'; // Test secret, replace with secure key in production

/* How to account for this file when testing in postman
Go to the "Headers" tab in Postman.
Add the following key-value pair:
Key: Authorization
Value: Bearer <your-token> (replace <your-token> with the token copied earlier).
*/



const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ error: 'Forbidden' });
        }
        req.user = user; // Attach the decoded token payload to the request object
        next(); // Pass control to the next middleware/route
    });
};

const createToken = (userId) => {
    return jwt.sign({ id: userId }, JWT_SECRET, { expiresIn: '1h' });
};

const verifyToken = (token) => {
    return jwt.verify(token, JWT_SECRET);
};

// Create a refresh token
const createRefreshToken = (userId) => {
    return jwt.sign({ id: userId }, REFRESH_TOKEN_SECRET, { expiresIn: '7d' });
};


module.exports = {createToken, authenticateToken, verifyToken, createRefreshToken };
