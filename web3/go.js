import { Keypair } from './keypair.js';
import Transaction from './transaction.js';

// 1. Generate Keypairs for sender and recipient
const senderKeypair = Keypair.generate();
const recipientKeypair = Keypair.generate();

// Display the public keys
console.log(`Sender Public Key: ${senderKeypair.publicKey}`);
console.log(`Recipient Public Key: ${recipientKeypair.publicKey}`);

// 2. Fund the Sender Account with an initial balance (e.g., 1000 VRT)
senderKeypair._vrtAccount._increaseBalance(1000);
console.log(`Initial balance of Sender: ${senderKeypair._vrtAccount.balance} VRT`);

// 3. Create a Transaction from sender to recipient
const amountToTransfer = 500; // Amount in VRT
const transaction = new Transaction(senderKeypair.publicKey, recipientKeypair.publicKey, amountToTransfer);

// 4. Sign the Transaction
transaction.signTransaction(senderKeypair);

// 5. Verify the Transaction
if (transaction.verifyTransaction()) {
  console.log("Transaction verified successfully.");
} else {
  console.log("Transaction verification failed.");
}

// 6. Execute the Transaction to transfer funds
try {
  transaction.execute(senderKeypair._vrtAccount, recipientKeypair._vrtAccount); // Pass the VRTAccount instances directly
  console.log(`New balance of Sender: ${senderKeypair._vrtAccount.balance} VRT`);
  console.log(`New balance of Recipient: ${recipientKeypair._vrtAccount.balance} VRT`);
} catch (error) {
  console.error(`Transaction failed: ${error.message}`);
}
