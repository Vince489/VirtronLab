import { Keypair } from './web3/keypair.js';  // Import the Keypair class
import SupplyManager from './web3/SupplyManager.js';  // Import the SupplyManager class
import Airdrop from './web3/airdrop.js';  // Import the Airdrop class

// Generate new keypairs for Kevin and Susan
const Kevin = Keypair.generate();
console.log(`Kevin's public key: ${Kevin.publicKey}`);

// Perform the airdrop to Kevin's public key (use Kevin's public key)
Airdrop.distribute(Kevin);

console.log(`Kevin's balance after airdrop: ${Kevin.balance} VRT`);  

// Get the total supply and circulating supply
console.log('Supply:', SupplyManager.getSupply());
