import { Keypair } from './keypair.js';


class Tokenomics {
  constructor() {
    // Total supply (in vinnies, 1 million VRT = 100 million vinnies)
    this.totalSupply = 1_000_000 * 1e8;  // 1 million VRT = 1,000,000 * 100,000,000 vinnies

    // Circulating supply (set initially to zero)
    this.circulatingSupply = 0;

    // Non-circulating supply (set initially to the total supply)
    this.nonCirculatingSupply = this.totalSupply;

    // Accounts
    this.foundersAccount = Keypair.generate();
    this.communityAccount = Keypair.generate();
    this.treasuryAccount = Keypair.generate();
  }

  // Method to fund the accounts and allocate to circulating supply
  fundAccounts() {
    // Amounts in VRT (not vinnies)
    const foundersFundVRT = 500_000;  // 500,000 VRT for founders
    const communityFundVRT = 300_000;  // 300,000 VRT for community
    const treasuryFundVRT = 200_000;  // 200,000 VRT for treasury

    // Convert VRT to vinnies
    const foundersFund = foundersFundVRT * 1e8;  // Convert 500,000 VRT to vinnies
    const communityFund = communityFundVRT * 1e8;  // Convert 300,000 VRT to vinnies
    const treasuryFund = treasuryFundVRT * 1e8;  // Convert 200,000 VRT to vinnies

    // Transfer funds to accounts
    this.foundersAccount._vrtAccount._increaseBalance(foundersFundVRT);  // Add 500,000 VRT to founders
    this.communityAccount._vrtAccount._increaseBalance(communityFundVRT);  // Add 300,000 VRT to community
    this.treasuryAccount._vrtAccount._increaseBalance(treasuryFundVRT);  // Add 200,000 VRT to treasury

    // Adjust circulating and non-circulating supply
    this.circulatingSupply += (foundersFund + communityFund + treasuryFund);
    this.nonCirculatingSupply -= (foundersFund + communityFund + treasuryFund);

    // Log the result
    console.log(`Founders Account funded with 500,000 VRT`);
    console.log(`Community Account funded with 300,000 VRT`);
    console.log(`Treasury Account funded with 200,000 VRT`);
    console.log(`Updated Supply: Total - ${this.totalSupply / 1e8} VRT, Circulating - ${this.circulatingSupply / 1e8} VRT, Non-Circulating - ${this.nonCirculatingSupply / 1e8} VRT`);
  }
}

const tokenomics = new Tokenomics();
tokenomics.fundAccounts();
