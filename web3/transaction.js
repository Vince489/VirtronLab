import { Keypair } from './keypair.js'; // Assuming Keypair is in the same directory
import VRTAccount from './VRTAccount.js'; // Correctly import VRTAccount

class Transaction {
  constructor(sender, recipient, amountInVRT) {
    this.sender = sender;            // Public key of the sender
    this.recipient = recipient;      // Public key of the recipient
    this.amount = amountInVRT;       // Amount in VRT
    this.timestamp = Date.now();     // Timestamp of the transaction
    this.signature = null;           // To be set after signing
  }

  // Convert transaction data to bytes for signing and verification
  _toBytes() {
    const data = JSON.stringify({
      sender: this.sender,
      recipient: this.recipient,
      amount: this.amount,
      timestamp: this.timestamp,
    });
    return new TextEncoder().encode(data);
  }

  // Sign the transaction using the sender's private key
  signTransaction(keypair) {
    if (keypair.publicKey !== this.sender) {
      throw new Error("Transaction can only be signed by the sender");
    }
    this.signature = keypair.sign(this._toBytes());
  }

  // Verify the transaction signature
  verifyTransaction() {
    if (!this.signature) {
      throw new Error("Transaction is not signed");
    }
    return Keypair.verify(this._toBytes(), this.signature, this.sender);
  }

  // Execute transaction, decreasing sender and increasing recipient balances
  execute(senderAccount, recipientAccount) {
    if (!senderAccount.hasBalance(this.amount)) {
      throw new Error("Insufficient funds in the sender's account");
    }

    // Perform the transaction by adjusting balances
    senderAccount._decreaseBalance(this.amount);
    recipientAccount._increaseBalance(this.amount);

    console.log(`Transaction of ${this.amount} VRT from ${this.sender} to ${this.recipient} completed successfully.`);
  }
}

export default Transaction;

