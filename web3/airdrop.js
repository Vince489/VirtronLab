import SupplyManager from './SupplyManager.js';
import VRTAccount from './VRTAccount.js';

class Airdrop {
  constructor() {
    this.supplyManager = SupplyManager;
  }

  // Airdrop a fixed amount of 50 VRT to the recipient
  distribute(recipientKeypair) {
    if (!recipientKeypair || !recipientKeypair._vrtAccount) {
      console.log("Error: Invalid recipient keypair or missing _vrtAccount");
      return;
    }

    const amountInVRT = 50;  // Fixed airdrop amount (no need to pass this as a parameter)
    const amountInVinnies = Math.floor(amountInVRT * VRTAccount.VRT_TO_VINNIES);  // Convert amount to vinnies

    // Log the airdrop initiation
    console.log(`Airdrop of ${amountInVRT} VRT initiated to ${recipientKeypair.publicKey}`);
    
    // Adjust circulating and non-circulating supply
    this.supplyManager.adjustCirculatingSupply(amountInVinnies);  // Increase circulating supply
    this.supplyManager.adjustNonCirculatingSupply(-amountInVinnies);  // Decrease non-circulating supply

    // Increase balance for recipient
    recipientKeypair._vrtAccount._increaseBalance(amountInVRT);  // Increase balance in VRT units

    // Log the recipient's balance after the airdrop
    console.log(`Recipient balance after airdrop: ${recipientKeypair.balance} VRT`);

    // Log after the airdrop
    console.log(`Airdropped ${amountInVRT} VRT to ${recipientKeypair.publicKey}`);
  }
}

export default new Airdrop();
