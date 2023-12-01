import {ethers} from "hardhat";
import {
    Smart,
    TokenERC20,
    Smart__factory,
    TokenERC20__factory
} from "../typechain-types";

describe("Smart", function () {
    let smartContract: Smart;
    let tokenContract: TokenERC20;

    beforeEach(async () => {
        const smartFactory: Smart__factory = await ethers.getContractFactory("Smart");
        const tokenERC20Factory: TokenERC20__factory = await ethers.getContractFactory("TokenERC20");
        smartContract = await smartFactory.deploy();
        tokenContract = await tokenERC20Factory.deploy();
    });
});
