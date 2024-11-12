class Validator {
  constructor(walletAddress, commissionRate) {
    this.walletAddress = walletAddress;
    this.commissionRate = commissionRate;
    this.stakeAccounts = [];
    this.totalDelegated = 0;
    this.performanceMetrics = { uptime: 0, blocksValidated: 0 };
  }

  // Adjust the validator's commission rate
  adjustCommission(newRate) {
    this.commissionRate = newRate;
    console.log(`Commission rate updated to ${newRate}%`);
  }

  // Add or update a delegator
  addDelegator(stakeAccount, amount) {
    const existingDelegator = this.stakeAccounts.find(acc => acc.stakeAccount === stakeAccount);
    if (existingDelegator) {
      existingDelegator.amount += amount;
    } else {
      this.stakeAccounts.push({ stakeAccount, amount });
    }
    this.totalDelegated += amount;
  }

  // Remove a delegator
  removeDelegator(stakeAccount) {
    const index = this.stakeAccounts.findIndex(acc => acc.stakeAccount === stakeAccount);
    if (index !== -1) {
      const { amount } = this.stakeAccounts[index];
      this.totalDelegated -= amount;
      this.stakeAccounts.splice(index, 1);
      console.log(`Removed delegator with stake account: ${stakeAccount}`);
    }
  }

  // Calculate individual reward
  calculateIndividualReward(stakeAccount) {
    const delegator = this.stakeAccounts.find(acc => acc.stakeAccount === stakeAccount);
    if (!delegator) throw new Error('Delegator not found');
    const totalRewards = this.calculateRewards();
    return (delegator.amount / this.totalDelegated) * (totalRewards - this.computeCommission(totalRewards));
  }

  // Update performance metrics
  updatePerformanceMetrics(metrics) {
    this.performanceMetrics = { ...this.performanceMetrics, ...metrics };
  }

  getPerformanceReport() {
    return this.performanceMetrics;
  }
}
