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
  distributeInitialSupply(distributions) {
    distributions.forEach(({ account, amount }) => {
      this._distributeToAccount(account, amount);
    });
  }

  // Private method to distribute VRT to a specific account
  _distributeToAccount(account, amountInVinnies) {
    // Ensure amount is in vinnies and deposit correctly
    account.deposit(amountInVinnies);  // Deposit in vinnies directly
    this.circulatingSupply += amountInVinnies;
    this.nonCirculatingSupply -= amountInVinnies;
    
    // Only add unique publicKeys to avoid duplicates
    if (!this.nonCirculatingAccounts.includes(account.publicKey)) {
      this.nonCirculatingAccounts.push(account.publicKey);
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
