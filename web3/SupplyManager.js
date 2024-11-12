import VRTAccount from './VRTAccount.js';  // Import the VRTAccount class

class SupplyManager {
  constructor() {
    this.totalSupply = 1_000_000 * 1e8; // 1 million VRT in vinnies
    this.circulatingSupply = 0;
    this.nonCirculatingSupply = this.totalSupply;
    this.nonCirculatingAccounts = [];
  }

  // Method to adjust the total supply
  adjustTotalSupply(amountInVinnies) {
    console.log(`Adjusting total supply by ${amountInVinnies} vinnies`);
    this.totalSupply += amountInVinnies;
  }

  // Method to adjust the circulating supply
  adjustCirculatingSupply(amountInVinnies) {
    console.log(`Adjusting circulating supply by ${amountInVinnies} vinnies`);
    this.circulatingSupply += amountInVinnies;
  }

  // Method to adjust the non-circulating supply
  adjustNonCirculatingSupply(amountInVinnies) {
    console.log(`Adjusting non-circulating supply by ${amountInVinnies} vinnies`);
    this.nonCirculatingSupply += amountInVinnies;
  }

  // Method to distribute the initial supply to accounts
  distributeInitialSupply(initialDistribution) {
    initialDistribution.forEach(({ account, amount }) => {
      console.log(`Distributing ${amount / 1e8} VRT to account ${account.publicKey}`);
  
      // Decrease non-circulating supply (tokens are being moved out of non-circulating pool)
      this.adjustNonCirculatingSupply(-amount);
  
      // Check if account is circulating and adjust accordingly
      if (account.isCirculating) {
        this.adjustCirculatingSupply(amount); // Add tokens to circulating supply
        console.log(`Account ${account.publicKey} is circulating. Added to circulating supply.`);
      } else {
        console.log(`Account ${account.publicKey} is non-circulating. Not added to circulating supply.`);
      }
  
      // Increase account balance (convert to VRT from vinnies)
      account._vrtAccount._increaseBalance(amount / VRTAccount.VRT_TO_VINNIES); // Convert to VRT
      console.log(`Account ${account.publicKey} new balance: ${account._vrtAccount.balance}`);
    });
  }
  

  // Private method to distribute VRT to a specific account
  _distributeToAccount(account, amountInVinnies) {
    // Ensure amount is in vinnies and deposit correctly
    if (!account._vrtAccount) {
      account._vrtAccount = new VRTAccount(account.publicKey); // Initialize if necessary
    }
    account._vrtAccount._increaseBalance(amountInVinnies);  // Update to access the VRTAccount's deposit method
    this.circulatingSupply += amountInVinnies;
    this.nonCirculatingSupply -= amountInVinnies;

    // Add the account's publicKey to nonCirculatingAccounts if it's not already there
    if (!this.nonCirculatingAccounts.includes(account.publicKey)) {
      this.nonCirculatingAccounts.push(account.publicKey);  // Ensure account.publicKey is accessible
    }
  }

  // Method to get the current supply
  getSupply() {
    return {
      total: this.totalSupply,
      circulating: this.circulatingSupply,
      nonCirculating: this.nonCirculatingSupply,
      nonCirculatingAccounts: this.nonCirculatingAccounts,
    };
  }
}

export default new SupplyManager();  // Export the singleton instance
