/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-require-imports */
const jwt = require('jsonwebtoken');

// Define the payload (the data you want to include in the token)
const payload = {
  partnerID: "partner123",
  role: "partner",
  issuer: "NodeJSService"
};

// Define a secret key to sign the JWT
const secretKey = "your-very-secure-secret-key";

// Generate the JWT token
const token = jwt.sign(payload, secretKey, { expiresIn: '1h' });

console.log("Generated JWT Token:", token);
