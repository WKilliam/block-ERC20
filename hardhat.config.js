
require("@nomiclabs/hardhat-ethers");
require("@nomiclabs/hardhat-waffle");
require("@nomicfoundation/hardhat-verify");


require('dotenv').config();

const { API_URL, PRIVATE_KEY, POLYGONSCAN_API_KEY } = process.env;

module.exports = {
  defaultNetwork: "hardhat",
  networks: {
    hardhat: {},
    mumbai: {
      url: API_URL || "https://polygon-testnet.public.blastapi.io/",
      accounts: [PRIVATE_KEY],
    },
  },
  solidity: {
    version: "0.8.0",
  },
  etherscan: {
    apiKey: POLYGONSCAN_API_KEY
 },
};