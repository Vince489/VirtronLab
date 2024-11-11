class VRTAccount {
  constructor(owner) {
    this.owner = owner;
    this._balanceInVinnies = 0; // Balance stored in vinnies
  }

  // Constants for conversion
  static VRT_TO_VINNIES = 1e8; // 1 VRT = 100,000,000 vinnies

  // Increase balance by an amount in VRT (floating point format)
  _increaseBalance(vrtAmount) {
    if (vrtAmount <= 0) throw new Error("Amount must be positive");

    const amountInVinnies = Math.floor(vrtAmount * VRTAccount.VRT_TO_VINNIES);
    this._balanceInVinnies += amountInVinnies;
  }

  // Decrease balance by an amount in VRT
  _decreaseBalance(vrtAmount) {
    const amountInVinnies = Math.floor(vrtAmount * VRTAccount.VRT_TO_VINNIES);
    if (this._balanceInVinnies < amountInVinnies) throw new Error("Insufficient balance");
    this._balanceInVinnies -= amountInVinnies;
  }

  // Getter for balance in VRT format (floating point)
  get balance() {
    return this._balanceInVinnies / VRTAccount.VRT_TO_VINNIES;
  }

  // Helper method to check if the balance is positive
  hasBalance(amount) {
    const amountInVinnies = Math.floor(amount * VRTAccount.VRT_TO_VINNIES);
    return this._balanceInVinnies >= amountInVinnies;
  }

  // Optional: Direct access to internal balance for edge cases
  get internalBalance() {
    return this._balanceInVinnies;
  }

}

export default VRTAccount;
