class Validator {
  constructor(walletAddress, commissionRate) {
    this.walletAddress = walletAddress;
    this.commissionRate = commissionRate;
    this.stakeAccounts = [];
    this.totalDelegated = 0; // VRT currently delegated to this validator
  }

  // Delegate VRT to this validator
  delegate(stakeAccount, amount) {
    this.stakeAccounts.push({ stakeAccount, amount });
    this.totalDelegated += amount;
    console.log(`Delegated ${amount} VRT to Validator ${this.walletAddress}`);
  }

  // Distribute rewards to all delegators
  distributeRewards() {
    const reward = this.calculateRewards(); // Placeholder for reward calculation logic
    const commission = this.computeCommission(reward);

    const delegatorReward = reward - commission;
    this.stakeAccounts.forEach(account => {
      const userReward = (account.amount / this.totalDelegated) * delegatorReward;
      account.stakeAccount._increaseBalance(userReward);
    });

    console.log(`Distributed ${delegatorReward} VRT to delegators with ${commission} VRT commission.`);
  }

  // Undelegate funds from this validator
  undelegate(stakeAccount) {
    const accountIndex = this.stakeAccounts.findIndex(acc => acc.stakeAccount === stakeAccount);
    if (accountIndex >= 0) {
      const { amount } = this.stakeAccounts[accountIndex];
      stakeAccount._increaseBalance(amount); // Returns staked funds
      this.stakeAccounts.splice(accountIndex, 1);
      this.totalDelegated -= amount;
      console.log(`Undelegated ${amount} VRT from Validator ${this.walletAddress}`);
    } else {
      console.log('Stake account not found.');
    }
  }

  // Compute commission based on rewards
  computeCommission(reward) {
    return (this.commissionRate / 100) * reward;
  }

  calculateRewards() {
    // Placeholder for calculating the reward amount
    return 100; // Example reward for demonstration
  }
}

export default Validator;
