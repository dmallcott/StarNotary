
const HDWalletProvider = require('@truffle/hdwallet-provider');

const fs = require('fs');
const mnemonic = fs.readFileSync(".secret").toString().trim();

module.exports = {
  networks: {
    develop: {
      port: 9545
    },
    rinkeby: {
      provider: () => new HDWalletProvider(mnemonic, `https://rinkeby.infura.io/v3/efe263b4367b4828aedbdc9bc0f1e759`),
        network_id: 4,       // rinkeby's id
        gas: 4500000,        // rinkeby has a lower block limit than mainnet
        gasPrice: 10000000000
    },
  },

  // Set default mocha options here, use special reporters etc.
  mocha: {
    // timeout: 100000
  },

  // Configure your compilers
  compilers: {
    solc: {
      version: "^0.8.0"
    }
  }
}
