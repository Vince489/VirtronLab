import express from 'express';
import VRTAccount from './web3/VRTAccount.js';

const app = express();
const port = 3000;

// Enable JSON body parsing
app.use(express.json());

// Define a method to handle the 'getBalance' RPC call
const getBalance = (params) => {
  // Assuming params contains an object with a 'publicKey' property
  const { publicKey } = params;
  
  // Ensure publicKey is provided
  if (!publicKey) {
    throw new Error('Public key is required');
  }

  // Instantiate VRTAccount with the provided publicKey
  const account = new VRTAccount(publicKey);

  // Return the account's balance in VRT
  return account.balance;  // This will return balance in VRT, already converted from vinnies
};

// Create a JSON-RPC endpoint to handle POST requests
app.post('/jsonrpc', (req, res) => {
  const { jsonrpc, id, method, params } = req.body;

  // Ensure the request follows JSON-RPC 2.0 format
  if (jsonrpc !== '2.0' || !id || !method) {
    return res.status(400).json({
      jsonrpc: '2.0',
      id: null,
      error: {
        code: -32600,  // Invalid Request
        message: 'Invalid Request'
      }
    });
  }

  // Handle the 'getBalance' method
  if (method === 'getBalance') {
    try {
      const balance = getBalance(params);
      return res.json({
        jsonrpc: '2.0',
        id: id,
        result: balance
      });
    } catch (error) {
      return res.json({
        jsonrpc: '2.0',
        id: id,
        error: {
          code: -32603,  // Internal error
          message: error.message
        }
      });
    }
  }

  // If the method is not recognized, return an error
  return res.json({
    jsonrpc: '2.0',
    id: id,
    error: {
      code: -32601,  // Method not found
      message: 'Method not found'
    }
  });
});

// Start the server
app.listen(port, () => {
  console.log(`JSON-RPC server running at http://localhost:${port}`);
});
