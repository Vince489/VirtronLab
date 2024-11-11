import bs58 from 'bs58';
import nacl from 'tweetnacl';
import bip39 from 'bip39';
import VRTAccount from './VRTAccount.js';

class Keypair {
  constructor(publicKey, privateKey) {
    this.publicKey = publicKey;
    this.privateKey = privateKey;
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

  // Transfer method
  transfer(amountInVRT, recipientKeypair) {
    const amountInVinnies = Math.floor(amountInVRT * VRTAccount.VRT_TO_VINNIES);  // Convert amount to vinnies

    if (this._vrtAccount._balanceInVinnies < amountInVinnies) {
        throw new Error('Insufficient funds');
    }

    // Withdraw from sender
    this._vrtAccount._decreaseBalance(amountInVRT);  // Decrease balance in VRT units

    // Deposit into recipient
    recipientKeypair._vrtAccount._increaseBalance(amountInVRT);  // Increase balance in VRT units

    console.log(`Transferred ${amountInVRT} VRT from ${this.publicKey} to ${recipientKeypair.publicKey}`);
  }

  // Signing and verification as before
  sign(message) {
    const messageData = new TextEncoder().encode(message);
    const privateKeyData = bs58.decode(this.privateKey);
    const signature = nacl.sign.detached(messageData, privateKeyData);
    console.log(`Signed message with publicKey: ${this.publicKey}`);
    return bs58.encode(signature);
  }

  static verify(message, signature, publicKey) {
    const decodedSignature = bs58.decode(signature);
    const decodedPublicKey = bs58.decode(publicKey);
    const messageUint8 = new TextEncoder().encode(message);
    const isValid = nacl.sign.detached.verify(messageUint8, decodedSignature, decodedPublicKey);
    console.log(`Message verification for publicKey ${publicKey}: ${isValid}`);
    return isValid;
  }

  // Validate seed phrase
  static validateSeedPhrase(seedPhrase) {
    return bip39.validateMnemonic(seedPhrase);
  }
}

export { Keypair };
