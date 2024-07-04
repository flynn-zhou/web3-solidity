require("@nomicfoundation/hardhat-toolbox");
require("hardhat-deploy");
require("dotenv").config();
require("@nomicfoundation/hardhat-verify");
require("@nomiclabs/hardhat-ethers");
require("hardhat-gas-reporter");


const { PRIVATE_KEY, SEPOLIA_RPC_URL, SEPOLIA_RPC_KEY, ETHERSCAN_API_KEY, GAS_REPORTOR, COINMARKETCAP_API_KEY } = process.env;
console.log("````````````GAS_REPORTOR~~~~~:"+GAS_REPORTOR);

module.exports = {
  solidity: "0.8.24",
  // solidity
  defaultNetwork: "hardhat",
  networks: {
    sepolia: {
      url: SEPOLIA_RPC_URL,
      accounts: [PRIVATE_KEY],
      chainId: 11155111,
      blockComfirmations: 6,
    },

  },
  namedAccounts: {
    deployer: {
      default: 0,
      1: 0,
    }
  },
  etherscan: {
    // Your API key for Etherscan
    // Obtain one at https://etherscan.io/
    apiKey: ETHERSCAN_API_KEY,
  },
  sourcify: {
    // Disabled by default
    // Doesn't need an API key
    enabled: false,
  },
  gasReporter: {
    enabled: GAS_REPORTOR ? true : false,
    outputFile: "gas-report.txt",
    noColors: true,
    currency: 'USD',
    // coinmarketcap: COINMARKETCAP_API_KEY, //don't need this,JUST gwei
    token: "ETH",
  },
};
