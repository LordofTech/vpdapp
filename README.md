# vpdapp
My Repository of Code for vpdapp
Below is the detailed documentation for both the **Java (Spring Boot)** and **Node.js** APIs, including endpoint descriptions, request formats, and how external partners can securely access and use them.

 1. Node.js Partner API Documentation
The Node.js Partner API is designed for external partners to authenticate and initiate financial transactions. It also allows partners to check the status of a transaction by communicating with the backend Java service.

Base URL: `http://localhost:3000/api`

Authentication Endpoint
1. POST `/partner/login`
   
   - Description: This endpoint is used by external partners to authenticate and generate a JWT token.
   - Request Headers: None.
   - Request Body:
     
     json
     {
       "username": "partner",
       "password": "partner123"
     }
     
     
   - Response:
     
     json
     {
       "token": "<jwt_token>"
     }
     
     
   - Usage Instructions:
     - Partners need to call this endpoint first and store the received JWT token.
     - The token must be used in the `Authorization` header for all subsequent API requests.
     - Example Request Using `curl`:
       
       bash
       curl -X POST http://localhost:3000/api/partner/login -H "Content-Type: application/json" -d '{"username": "partner", "password": "partner123"}'
      

Initiate Transaction
2. POST `/partner/transaction`
   
   - Description: This endpoint initiates a financial transaction by sending the transaction details to the backend Java API.
   - Request Headers:
     
     
     Authorization: Bearer <jwt_token>
    
     
   - Request Body:
     
     json
     {
       "amount": 1000,
       "currency": "USD",
       "senderAccount": "123456789",
       "receiverAccount": "987654321",
       "description": "Invoice Payment"
     }
    
     
   - Response:
     
     json
     {
       "transactionId": "txn_123456",
       "status": "Processing"
     }
     
     
   - Usage Instructions:
     - Ensure that a valid JWT token is included in the `Authorization` header.
     - Only authenticated users can initiate transactions.
     - Example Request Using `curl`:
       
       bash
       curl -X POST http://localhost:3000/api/partner/transaction -H "Authorization: Bearer <jwt_token>" -H "Content-Type: application/json" -d '{"amount": 1000, "currency": "USD", "senderAccount": "123456789", "receiverAccount": "987654321", "description": "Invoice Payment"}'
      

Check Transaction Status
3. GET`/partner/transaction-status/:transactionId`
   
   - Description: This endpoint retrieves the status of a specific transaction.
   - Request Headers:
     
    
     Authorization: Bearer <jwt_token>
    
     
   - Request Parameters:
     - `transactionId`: The ID of the transaction to check.
     
   - Response:
     
     json
     {
       "transactionId": "txn_123456",
       "status": "Completed"
     }
   
     
   - Usage Instructions:
     - Include the valid JWT token in the `Authorization` header.
     - Use the `transactionId` obtained during the initiation of a transaction.
     - Example Request Using `curl`:
       
       bash
       curl -X GET http://localhost:3000/api/partner/transaction-status/txn_123456 -H "Authorization: Bearer <jwt_token>"
       

2. Java Transaction Processing API Documentation
The Java (Spring Boot) API is responsible for processing transactions initiated by the Node.js Partner API. It validates the transaction details, performs the transaction, and returns the status.

Base URL: `http://localhost:8080/api/transaction`

Process Transaction
1. POST`/process`
   
   - Description: Processes the financial transaction with the provided details.
   - Request Headers:
     
     
     Authorization: Bearer <jwt_token>
     
     
   - Request Body:
     
     json
     {
       "amount": 1000,
       "currency": "USD",
       "senderAccount": "123456789",
       "receiverAccount": "987654321",
       "description": "Invoice Payment"
     }
     
     
   - Response:
     
     json
     {
       "transactionId": "txn_123456",
       "status": "Processing"
     }
     
     
   - Usage Instructions:
     - Only valid JWT tokens are accepted for this API.
     - Make sure to pass the token in the `Authorization` header.
     - This API should be called by the Node.js service.
     - Example Request Using `curl`:
       
       bash
       curl -X POST http://localhost:8080/api/transaction/process -H "Authorization: Bearer <jwt_token>" -H "Content-Type: application/json" -d '{"amount": 1000, "currency": "USD", "senderAccount": "123456789", "receiverAccount": "987654321", "description": "Invoice Payment"}'
       

Check Transaction Status
2. GET `/status/:transactionId`
   
   - Description: Retrieves the status of a transaction using the transaction ID.
   - Request Headers:
     
     
     Authorization: Bearer <jwt_token>
    
     
   - Request Parameters:
     - `transactionId`: The unique identifier for the transaction.
     
   - Response:
     
     json
     {
       "transactionId": "txn_123456",
       "status": "Completed"
     }
     
     
   - Usage Instructions:
     - Include a valid JWT token in the `Authorization` header.
     - Use the transaction ID provided during transaction initiation.
     - Example Request Using `curl`:
       
       bash
       curl -X GET http://localhost:8080/api/transaction/status/txn_123456 -H "Authorization: Bearer <jwt_token>"
       

Security Best Practices for External Partners:
1. Use Secure Tokens:
   - Always use the generated JWT token in the `Authorization` header.
   - Never expose the token in URLs or client-side code.

2. Rate Limit Your Requests:
   - The `/api` endpoints have rate limiting enabled. Do not exceed 100 requests in a 15-minute window.

3. Refresh Tokens Regularly:
   - If the token expires, re-authenticate using the `/api/partner/login` endpoint.

4. Use HTTPS:
   - Make sure to use `https://` in production to encrypt data transmission.
