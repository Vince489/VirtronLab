import { Client } from 'rpc-websockets';
import { Keypair } from './keypair.js';

// Connect to the bootstrap server
const server = new Client('ws://localhost:8085');

// Function to sign and send data to the bootstrap server
async function main() {
  try {
    // Wait for the server to be ready
    await new Promise((resolve, reject) => {
      server.on('open', resolve); // Wait for the 'open' event
      server.on('error', reject); // Reject if there's an error during connection
    });

    console.log('Connected to bootstrap server');

    // Generate a new seed phrase
    const seedPhrase = await Keypair.generateSeedPhrase();
    console.log('Generated Seed Phrase:', seedPhrase);

    // Generate a new keypair from the seed phrase
    const pair = Keypair.fromSeedPhrase(seedPhrase);
    console.log('Generated public key:', pair.publicKey);

    // The message you want to sign and verify
    const message = 'Peer registration request';

    // Sign the message using the private key
    const signature = pair.sign(message);

    // Send the public key and signature to the bootstrap server for registration
    const response = await server.call('registerPeer', {
      publicKey: pair.publicKey,   // Public key
      signature: signature,        // Signed message
      message: message,            // Message to be registered
      ip: '127.0.0.1',             // The local IP or dynamically discovered IP
      port: 8085,                  // The port for this peer
      role: 'validator',           // Default role (optional, can be customized)
      slotIdentifier: 'slot1'      // Slot identifier (optional)
    });

    console.log('Registration response:', response);

  } catch (error) {
    console.error('Error during registration:', error);
  }

  // Close the server connection when done
  server.on('close', () => {
    console.log('Disconnected from bootstrap server');
  });
}

// Call the main function
main().catch(console.error);
