// deploy.js

async function main() {
  const [deployer] = await ethers.getSigners();

  console.log("Deploying MyToken and MyCrowdsale to Mumbai...");

  const MyToken = await ethers.getContractFactory("MyToken");
  const myToken = await MyToken.deploy();
  await myToken.deployed();
  console.log("MyToken deployed to:", myToken.address);

  const MyCrowdsale = await ethers.getContractFactory("MyCrowdsale");
  const myCrowdsale = await MyCrowdsale.deploy(
    myToken.address,
    100, // rate
    1, // minPurchase
    10, // maxPurchase
    100, // hardCap
    Math.floor(Date.now() / 1000) + 3600, // startTime
    Math.floor(Date.now() / 1000) + 7200 // endTime
  );
  await myCrowdsale.deployed();
  console.log("MyCrowdsale deployed to:", myCrowdsale.address);

  // Mint some initial tokens for testing
  console.log("Minting initial tokens for testing...");
  await myToken.mint(myCrowdsale.address, 1000);

  console.log("Deployment complete!");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });