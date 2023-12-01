
require("@nomiclabs/hardhat-ethers");
require("@nomiclabs/hardhat-waffle");
require("@nomicfoundation/hardhat-verify");


require('dotenv').config();

const { API_URL, PRIVATE_KEY, POLYGONSCAN_API_KEY } = process.env;

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

task("deploy-and-verify", "Deploys and verifies contracts on Polygonscan")
    .addParam("contractname", "The name of the contract to deploy")
    .setAction(async (taskArgs, hre) => {
        const { ethers, run } = hre;

        const [deployer] = await ethers.getSigners();
        console.log("Deploying contracts with the account:", deployer.address);

        const ContractFactory = await ethers.getContractFactory(taskArgs.contractname);
        const contract = await ContractFactory.deploy(/* arguments */);
        await contract.deployed();

        console.log("Contract address:", contract.address);

        try {
            await sleep(10000);

            await run("verify", {
                address: contract.address,
            });

            console.log("Contract verified on Polygonscan");
        } catch (error) {
            console.error("Error verifying contract on Polygonscan:", error.message);
        }
    });

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
