/* eslint-disable @typescript-eslint/no-require-imports */
/* eslint-disable no-undef */
const jwt = require('jsonwebtoken');

// The secret key must match the one used to sign the token
const secretKey = 'your-secret-key'; // Replace with the shared secret key

// Middleware to authenticate JWT
function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token == null) return res.status(401).send('Unauthorized: Token not provided');

    jwt.verify(token, secretKey, (err, user) => {
        if (err) return res.status(403).send('Forbidden: Invalid token');
        req.user = user;
        next();
    });
}

module.exports = authenticateToken;
