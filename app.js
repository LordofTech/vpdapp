/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-require-imports */
// Import required modules and dependencies
const express = require('express'); // Express framework for building the API
const jwt = require('jsonwebtoken'); // JWT library for authentication
const axios = require('axios'); // Axios library for making HTTP requests to the Java API
const rateLimit = require('express-rate-limit'); // Rate limiting for security

// Create an instance of the Express application
const app = express();
app.use(express.json()); // Middleware to parse incoming JSON request bodies

// Define the port number for the Node.js server
const PORT = process.env.PORT || 3000;

// JWT Secret Key for signing and verifying tokens
const JWT_SECRET = 'your-very-secure-secret-key'; // Change this to your actual secret key

// Middleware to authenticate JWT tokens
const authenticateToken = (req, res, next) => {
  // Extract the JWT token from the 'Authorization' header
  const token = req.header('Authorization') && req.header('Authorization').split(' ')[1];
  if (!token) return res.sendStatus(401); // If no token is provided, return 401 Unauthorized
  
  // Verify the token
  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403); // If the token is invalid or expired, return 403 Forbidden
    req.user = user; // Attach user information to the request object
    next(); // Proceed to the next middleware or route handler
  });
};

// Apply rate limiting to all `/api` routes to prevent abuse
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // Time window of 15 minutes
  max: 100, // Limit each IP to 100 requests per window
  message: "Too many requests, please try again later." // Error message on exceeding limit
});
app.use('/api', limiter); // Apply rate limiting to all routes under /api

// Route: Authenticate and Generate JWT Token
app.post('/api/partner/login', (req, res) => {
  const { username, password } = req.body;

  // Mock user validation (Replace this with a database lookup in real-world applications)
  if (username === 'partner' && password === 'partner123') {
    // Generate a JWT token with the username as the payload
    const token = jwt.sign({ user: username, partnerID: 'partner123' }, JWT_SECRET, { expiresIn: '1h' });
    res.json({ token }); // Return the generated token to the client
  } else {
    res.status(401).json({ message: 'Invalid username or password' }); // Return 401 if credentials are invalid
  }
});

// Route: Initiate a Financial Transaction (Communicates with Java API)
app.post('/api/partner/transaction', authenticateToken, async (req, res) => {
  const transactionRequest = req.body; // Extract the transaction details from the request body

  try {
    // Send the transaction details to the Java API using Axios
    const response = await axios.post('http://localhost:8080/api/transaction/process', transactionRequest, {
      headers: { 'Authorization': `Bearer ${req.header('Authorization')}` } // Pass the same JWT token to the Java API
    });
    res.json(response.data); // Return the response from the Java API to the client
  } catch (error) {
    res.status(500).json({ message: "Transaction failed", error: error.message }); // Return error if the transaction fails
  }
});

// Route: Check the Status of a Transaction (Communicates with Java API)
app.get('/api/partner/transaction-status/:transactionId', authenticateToken, async (req, res) => {
  try {
    // Make a GET request to the Java API to get the status of a specific transaction
    const response = await axios.get(`http://localhost:8080/api/transaction/status/${req.params.transactionId}`, {
      headers: { 'Authorization': `Bearer ${req.header('Authorization')}` }
    });
    res.json(response.data); // Return the status of the transaction to the client
  } catch (error) {
    res.status(500).json({ message: "Unable to retrieve status", error: error.message }); // Return error if the status check fails
  }
});

// Start the Node.js server on the specified port
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
