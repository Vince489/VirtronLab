import { Server } from 'rpc-websockets';
import bs58 from 'bs58';
import nacl from 'tweetnacl';


const peers = new Map(); // Use a Map for storing peer metadata

const bootstrapServer = new Server({
    port: 8085,
    host: 'localhost'
});

// Helper function to validate signatures
function verifySignature(publicKey, signature, message) {
    const decodedPublicKey = bs58.decode(publicKey);
    const decodedSignature = bs58.decode(signature);
    const messageBuffer = new TextEncoder().encode(message);
    return nacl.sign.detached.verify(messageBuffer, decodedSignature, decodedPublicKey);
}

// Register a method for peers to register with metadata
bootstrapServer.register('registerPeer', async (params) => {
    const { publicKey, signature, message, ip, port, role = 'regular', slotIdentifier = null } = params;

    console.log('Received request to register peer:', publicKey);

    if (!publicKey || !signature || !message) {
        return { success: false, error: 'Invalid parameters' };
    }

    // Verify the signature using public key
    const isValid = verifySignature(publicKey, signature, message);
    if (!isValid) {
        return { success: false, error: 'Signature verification failed' };
    }

    // Store peer data
    peers.set(publicKey, {
        ip,
        port,
        role,
        slotIdentifier,
        registeredAt: Date.now(),
        lastSeen: Date.now()
    });

    console.log(`Peer registered: ${publicKey} with IP: ${ip}, Port: ${port}, Role: ${role}, Slot ID: ${slotIdentifier}`);

    // Return the updated peer list
    return { success: true, peers: Array.from(peers.entries()).map(([key, value]) => ({ publicKey: key, ...value })) };
});

// Method to fetch the list of known peers
bootstrapServer.register('getKnownPeers', () => {
    console.log('Returning list of known peers');
    return Array.from(peers.entries()).map(([key, value]) => ({ publicKey: key, ...value }));
});

// Update lastSeen for active peers to manage peer activity status
bootstrapServer.on('connection', (client) => {
    console.log('New client connected');
    
    client.on('close', () => {
        // Handle disconnection if needed (not removing for simplicity, but can be modified to remove inactive peers)
        console.log('Client disconnected');
    });
});

// Periodically clean up peers with outdated metadata
setInterval(() => {
    const cutoff = Date.now() - 5 * 60 * 1000; // 5 minutes
    for (const [publicKey, peerData] of peers) {
        if (peerData.lastSeen < cutoff) {
            peers.delete(publicKey);
            console.log(`Removed inactive peer: ${publicKey}`);
        }
    }
}, 60 * 1000); // Cleanup every minute

console.log('Bootstrap server is running on ws://localhost:8085');
