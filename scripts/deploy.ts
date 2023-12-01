import { ethers } from "hardhat";
import {TokenERC20} from "../typechain-types";

async function main() {
  const Token = await ethers.getContractFactory("TokenERC20");
  const token = await Token.deploy("BearManCoin", "BMC");
// Attendez que le contrat TokenERC20 soit déployé
  const tkAdress = await token.waitForDeployment();

  console.log("TokenERC20 contract deployed to:", await tkAdress.getAddress());

  const Smart = await ethers.getContractFactory("Smart");
  const smart = await Smart.deploy(
      tkAdress.getAddress(),
      ethers.parseEther("1000")
  );

  // Attendez que le contrat Smart soit déployé
  await smart.waitForDeployment()

  console.log("Smart contract deployed to:", await smart.getAddress());

}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
