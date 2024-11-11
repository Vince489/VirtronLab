import express from 'express';

const app = express();
const port = 3000;

// Enable JSON body parsing
app.use(express.json());

// Define a method to handle account creation
const createAccount = () => {
  // Generate a public key (placeholder logic, replace with actual keypair generation)
  const publicKey = 'newlyGeneratedPublicKeyHere';
  return publicKey;
};

// Define a method to handle the 'getBalance' RPC call
const getBalance = (params) => {
  // Replace with logic to retrieve balance by publicKey
  const balance = 1000; // Example static balance
  return balance;
};

// Define the JSON-RPC handler
app.post('/jsonrpc', (req, res) => {
  const { jsonrpc, id, method, params } = req.body;

  // Ensure the request follows JSON-RPC 2.0 format
  if (jsonrpc !== '2.0' || id === undefined || !method) {
    return res.status(400).json({
      jsonrpc: '2.0',
      id: null,
      error: {
        code: -32600,  // Invalid Request
        message: 'Invalid Request'
      }
    });
  }

  // Handle 'createAccount' method
  if (method === 'createAccount') {
    try {
      const publicKey = createAccount();
      return res.json({
        jsonrpc: '2.0',
        id: id,
        result: publicKey
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

  // Handle 'getBalance' method
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
