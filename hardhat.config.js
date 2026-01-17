import "@nomicfoundation/hardhat-toolbox";
import "dotenv/config";
import "solidity-coverage";
import "hardhat-gas-reporter";

/** @type import('hardhat/config').HardhatUserConfig */
export default {
  solidity: "0.8.20",
  gasReporter: {
    enabled: true,
    currency: "USD",
    showTimeSpent: true,
    excludeContracts: [],
  },
  networks: {
    sepolia: {
      url: process.env.SEPOLIA_RPC_URL,
      accounts: [process.env.PRIVATE_KEY],
    },
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY
  },
  sourcify: {
    enabled: true
  }
};
