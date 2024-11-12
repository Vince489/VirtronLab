import { Keypair } from './keypair.js';

// Example usage
const userWallet = Keypair.generate();  // User's main wallet keypair

// Initial wallet funding for testing purposes
userWallet._vrtAccount._increaseBalance(1000);
console.log(`User wallet balance: ${userWallet.balance} VRT`);

// Create a new stake account with 500 VRT, locked for 7 days
const unlockDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days from now
const stakeAccount = userWallet.createStakeAccount(500, unlockDate);

// Attempting to withdraw during lock period (should throw error)
try {
  userWallet.withdrawFromStakeAccount(stakeAccount.accountAddress, 100);
} catch (error) {
  console.error(`Withdraw failed: ${error.message}`);
}

// After 7 days, the account unlocks, allowing withdrawal
setTimeout(() => {
  // Withdraw 200 VRT (this triggers cool-down period for withdrawal)
  userWallet.withdrawFromStakeAccount(stakeAccount.accountAddress, 200);
}, 7 * 24 * 60 * 60 * 1000 + 1000); // Check just after 7 days

// Checking balance after cool-down period completes
setTimeout(() => {
  console.log(`Wallet balance after cool-down: ${userWallet.balance} VRT`);
}, 7 * 24 * 60 * 60 * 1000 + 5000); // Example 5 seconds after 7-day period
