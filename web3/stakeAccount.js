import bs58 from 'bs58';
import nacl from 'tweetnacl';

class StakeAccount {
  constructor(ownerPublicKey, amount = 0, lockUntil = null) {
    this.accountAddress = bs58.encode(nacl.sign.keyPair().publicKey); // Unique address
    this.ownerPublicKey = ownerPublicKey;  // Tied to the main wallet's public key
    this.balance = amount;  // VRT staked in this account
    this.lockUntil = lockUntil; // Date or null if not locked
    this.coolDownPeriod = 0;  // Cool-down period (e.g., seconds or ms)
    this.isInCoolDown = false; // True if in cool-down status
  }

  // Lock funds until a specific date
  lockFunds(unlockDate) {
    this.lockUntil = unlockDate;
    console.log(`StakeAccount locked until ${unlockDate}`);
  }

  // Trigger the cool-down period for funds
  startCoolDown(coolDownTimeMs) {
    this.coolDownPeriod = coolDownTimeMs;
    this.isInCoolDown = true;
    setTimeout(() => {
      this.isInCoolDown = false;
      console.log(`Cool-down period ended for ${this.accountAddress}`);
    }, coolDownTimeMs);
  }

  // Check if funds are currently locked
  isLocked() {
    return this.lockUntil && new Date() < new Date(this.lockUntil);
  }

  // Deposit VRT into the stake account
  deposit(amount) {
    if (this.isLocked()) {
      throw new Error("Account is currently locked; deposit not allowed.");
    }
    this.balance += amount;
    console.log(`Deposited ${amount} VRT into StakeAccount ${this.accountAddress}`);
  }

  // Withdraw VRT from the stake account, triggering cool-down if applicable
  withdraw(amount) {
    if (this.isLocked()) {
      throw new Error("Account is currently locked; withdrawal not allowed.");
    }
    if (this.balance < amount) {
      throw new Error("Insufficient balance in stake account.");
    }
    this.balance -= amount;
    this.startCoolDown(3000); // Example cool-down of 3 seconds
    return amount;
  }
}

export default StakeAccount;
