import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
require("dotenv").config();
const PRIVATE_KEY = process.env.PRIVATE_KEY ?? "";


const config: HardhatUserConfig = {
  solidity: "0.8.20",
  defaultNetwork: "hardhat",
  networks: {
    hardhat: {},
    mumbai: {
      accounts: [PRIVATE_KEY],
      url: "https://polygon-testnet.public.blastapi.io/", // Remplacez par la clé privée de votre compte Ethereum
    },
  },
};
export default config;
