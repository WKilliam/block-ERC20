const { expect } = require("chai");
const { ethers } = require("hardhat");


describe("MyCrowdsale", function () {
  it("Should deploy and buy tokens", async function () {
    const [owner, buyer] = await ethers.getSigners();

    const MyToken = await ethers.getContractFactory("MyToken");
    const myToken = await MyToken.deploy();
    await myToken.deployed();

    // Set startTime to be 1 hour from now and endTime to be 2 hours from now
    const startTime = Math.floor(Date.now() / 1000) + 3600;
    const endTime = Math.floor(Date.now() / 1000) + 7200;

    const MyCrowdsale = await ethers.getContractFactory("MyCrowdsale");
    const myCrowdsale = await MyCrowdsale.deploy(
        myToken.address,
        100, // rate
        1, // minPurchase
        10, // maxPurchase
        100, // hardCap
        startTime,
        endTime
    );
    await myCrowdsale.deployed();

    await myToken.mint(myCrowdsale.address, 1000);

    // Fast-forward time to make sure the crowdsale is open
    await ethers.provider.send("evm_setNextBlockTimestamp", [startTime + 600]);

    const initialBalance = await myToken.balanceOf(buyer.address);

    await myCrowdsale.connect(buyer).buyTokens(buyer.address, { value: ethers.utils.parseEther("1") });

    const finalBalance = await myToken.balanceOf(buyer.address);
    expect(finalBalance).to.be.above(initialBalance);
  });

  it("Should finalize and allow owner to claim tokens", async function () {
    const [owner, buyer] = await ethers.getSigners();

    const MyToken = await ethers.getContractFactory("MyToken");
    const myToken = await MyToken.deploy();
    await myToken.deployed();

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

    await myToken.mint(myCrowdsale.address, 1000);

    const initialBalance = await myToken.balanceOf(buyer.address);

    await myCrowdsale.connect(buyer).buyTokens(buyer.address, { value: ethers.utils.parseEther("1") });

    const finalBalance = await myToken.balanceOf(buyer.address);
    expect(finalBalance).to.be.above(initialBalance);

    await myCrowdsale.connect(owner).finalize();

    const unsoldTokens = await myToken.balanceOf(owner.address);
    expect(unsoldTokens).to.be.above(0);

    await myCrowdsale.connect(owner).claimUnsoldTokens();

    const ownerBalance = await myToken.balanceOf(owner.address);
    expect(ownerBalance).to.be.above(unsoldTokens);
  });
});
