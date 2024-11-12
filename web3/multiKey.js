import bs58 from 'bs58';
import nacl from 'tweetnacl';
import bip39 from 'bip39';
import VRTAccount from './VRTAccount.js';
import StakeAccount from './stakeAccount.js';

class Keypair {
  constructor(publicKey, privateKey) {
    this.publicKey = publicKey;
    this.privateKey = privateKey;
    this.stakeAccounts = [];  // Array to hold multiple stake accounts
    this._vrtAccount = new VRTAccount(publicKey); // Internal VRTAccount instance
  }

  // Generate a new keypair
  static generate() {
    const { publicKey, secretKey: privateKey } = nacl.sign.keyPair();
    const keypair = new Keypair(bs58.encode(publicKey), bs58.encode(privateKey));
    return keypair;
  }

  // Generate a keypair from a seed phrase
  static fromSeedPhrase(seedPhrase) {
    const seed = bip39.mnemonicToSeedSync(seedPhrase).slice(0, 32);
    const { publicKey, secretKey: privateKey } = nacl.sign.keyPair.fromSeed(seed);
    const keypair = new Keypair(bs58.encode(publicKey), bs58.encode(privateKey));
    console.log(`Generated keypair from seed phrase for publicKey: ${keypair.publicKey}`);
    return keypair;
  }

  // Generate a new seed phrase
  static generateSeedPhrase() {
    const seedPhrase = bip39.generateMnemonic(); // This generates a new 12-word seed phrase
    console.log(`Generated new seed phrase: ${seedPhrase}`);
    return seedPhrase;
  }

  // Retrieve a keypair from a seed phrase
  static retrieveKeypairFromSeedPhrase(seedPhrase) {
    if (!Keypair.validateSeedPhrase(seedPhrase)) {
      throw new Error('Invalid seed phrase provided.');
    }
    return Keypair.fromSeedPhrase(seedPhrase);
  }

  // Get balance method
  get balance() {
    const balance = this._vrtAccount.balance;
    console.log(`Current balance for ${this.publicKey}: ${balance} VRT`);
    return balance;
  }

  // Create a new stake account and move VRT into it
  createStakeAccount(amount, lockUntil = null) {
    if (this._vrtAccount.balance < amount) {
      throw new Error("Insufficient wallet balance for staking.");
    }

    // Transfer from wallet balance to new stake account
    this._vrtAccount._decreaseBalance(amount);  
    const stakeAccount = new StakeAccount(this.publicKey, amount, lockUntil);
    this.stakeAccounts.push(stakeAccount);

    console.log(`Created StakeAccount ${stakeAccount.accountAddress} with ${amount} VRT.`);
    return stakeAccount;
  }

  // Authorize (retrieve) a specific stake account by address
  getStakeAccount(accountAddress) {
    return this.stakeAccounts.find(acc => acc.accountAddress === accountAddress);
  }

  // Move VRT back to wallet after cool-down
  withdrawFromStakeAccount(accountAddress, amount) {
    const stakeAccount = this.getStakeAccount(accountAddress);
    if (!stakeAccount) {
      throw new Error("Stake account not found.");
    }

    // Withdraw from stake account and add back to main wallet after cool-down
    const withdrawnAmount = stakeAccount.withdraw(amount);
    this._vrtAccount._increaseBalance(withdrawnAmount);
    console.log(`Withdrew ${withdrawnAmount} VRT from StakeAccount ${accountAddress} back to main wallet.`);
  }

  // Transfer method with multisig capabilities
  async transfer(amountInVRT, recipientKeypair, multisigSigners = [], requiredSignatures = 2) {
    // Convert amount to vinnies
    const amountInVinnies = Math.floor(amountInVRT * VRTAccount.VRT_TO_VINNIES);

    if (this._vrtAccount._balanceInVinnies < amountInVinnies) {
      throw new Error('Insufficient funds');
    }

    // Collect signatures from all signers
    const signatures = [];
    for (const signer of multisigSigners) {
      const signature = await signer.signTransaction({ amountInVRT, recipient: recipientKeypair.publicKey });
      signatures.push(signature);
    }

    // Check if the number of valid signatures meets the required threshold
    if (signatures.length < requiredSignatures) {
      throw new Error(`Insufficient signatures. Required: ${requiredSignatures}, received: ${signatures.length}`);
    }

    // Withdraw from sender
    this._vrtAccount._decreaseBalance(amountInVRT);  // Decrease balance in VRT units

    // Deposit into recipient
    recipientKeypair._vrtAccount._increaseBalance(amountInVRT);  // Increase balance in VRT units

    console.log(`Transferred ${amountInVRT} VRT from ${this.publicKey} to ${recipientKeypair.publicKey}`);
  }

  // Signing method for multisig transaction
  signTransaction(transaction) {
    const messageData = new TextEncoder().encode(JSON.stringify(transaction));
    const privateKeyData = bs58.decode(this.privateKey);
    const signature = nacl.sign.detached(messageData, privateKeyData);
    console.log(`Signed transaction with publicKey: ${this.publicKey}`);
    return bs58.encode(signature);
  }

  // Verify transaction signature
  static verifyTransaction(transaction, signature, publicKey) {
    const decodedSignature = bs58.decode(signature);
    const decodedPublicKey = bs58.decode(publicKey);
    const messageUint8 = new TextEncoder().encode(JSON.stringify(transaction));
    const isValid = nacl.sign.detached.verify(messageUint8, decodedSignature, decodedPublicKey);
    console.log(`Transaction verification for publicKey ${publicKey}: ${isValid}`);
    return isValid;
  }

  // Validate seed phrase
  static validateSeedPhrase(seedPhrase) {
    return bip39.validateMnemonic(seedPhrase);
  }
}

export { Keypair };
