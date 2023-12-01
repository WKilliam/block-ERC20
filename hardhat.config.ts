import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "dotenv/config";


const config: HardhatUserConfig = {
  solidity: "0.8.19",
  networks: {
    mumbai: {
      url: "https://polygon-testnet.public.blastapi.io/",
      chainId: 80001,
      accounts: [process.env.PRIVATE_KEY as string], // Remplacez par la clé privée de votre compte Ethereum
    },
  },
};
export default config;
