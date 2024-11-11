const bs58 = require('bs58');
const nacl = require('tweetnacl');
const crypto = require('crypto');
const bip39 = require('bip39');

class Keypair {
  constructor(publicKey, secretKey) {
    this.publicKey = publicKey;
    this.privateKey = secretKey;
  }

  // Generate a new keypair
  static generate() {
    const { publicKey, secretKey } = nacl.sign.keyPair();
    return new Keypair(bs58.encode(publicKey), bs58.encode(secretKey));
  }

  // Generate a keypair from a seed phrase
  static fromSeedPhrase(seedPhrase) {
    try {
      const seed = bip39.mnemonicToSeedSync(seedPhrase).slice(0, 32);
      const { publicKey, secretKey } = nacl.sign.keyPair.fromSeed(seed);
      return new Keypair(bs58.encode(publicKey), bs58.encode(secretKey));
    } catch (error) {
      throw new Error(`Failed to generate keypair from seed phrase: ${error.message}`);
    }
  }

  // Validate seed phrase
  static async validateSeedPhrase(seedPhrase) {
    return bip39.validateMnemonic(seedPhrase);
  }

  // Retrieve keypair from a seed phrase
  static async retrieveKeypairFromSeedPhrase(seedPhrase) {
    const isValid = await Keypair.validateSeedPhrase(seedPhrase);
    if (!isValid) {
      throw new Error('Invalid seed phrase provided.');
    }
    return Keypair.fromSeedPhrase(seedPhrase);
  }

  // Generate a new seed phrase
  static async generateSeedPhrase() {
    return bip39.generateMnemonic();
  }

  sign(message) {
  try {
      const messageData = new TextEncoder().encode(message);
      const privateKeyData = bs58.decode(this.privateKey);  // Decode only once here
      const signature = nacl.sign.detached(messageData, privateKeyData);
      return bs58.encode(signature);  // Encode the signature to Base58 only once
  } catch (error) {
      throw new Error('Failed to sign message: ' + error.message);
  }
}

  // Verify a signature
  static verify(message, signature, publicKey) {
    try {
      // Ensure signature and publicKey are Base58-encoded strings
      if (typeof signature !== 'string' || typeof publicKey !== 'string') {
        throw new TypeError('Expected signature and publicKey to be Base58-encoded strings');
      }

      // Decode the signature and publicKey from Base58
      const decodedSignature = bs58.decode(signature);
      const decodedPublicKey = bs58.decode(publicKey);

      // Encode the message to Uint8Array format
      const messageUint8 = new TextEncoder().encode(message);

      // Use nacl.sign.detached.verify to verify the signature
      const isValid = nacl.sign.detached.verify(messageUint8, decodedSignature, decodedPublicKey);

      return isValid;
    } catch (error) {
      throw new Error('Failed to verify signature: ' + error.message);
    }
  }
}

module.exports = Keypair;
