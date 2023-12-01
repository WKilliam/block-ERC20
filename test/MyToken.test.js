const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("MyToken", function () {
  it("Should deploy and mint tokens", async function () {
    const [owner, account] = await ethers.getSigners();

    const MyToken = await ethers.getContractFactory("MyToken");
    const myToken = await MyToken.deploy();
    await myToken.deployed();

    const initialBalance = await myToken.balanceOf(account.address);
    expect(initialBalance).to.equal(0);

    await myToken.connect(owner).mint(account.address, 1000);

    const finalBalance = await myToken.balanceOf(account.address);
    expect(finalBalance).to.equal(1000);
  });
});