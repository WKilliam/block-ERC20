// import {expect} from "chai";
// import {ethers} from "hardhat";
// import {Counter, Counter__factory} from "../typechain-types";
//
// describe("Counter", function () {
//     let counter: Counter;
//
//     beforeEach(async function () {
//         const counterFactory: Counter__factory = await ethers.getContractFactory("Counter");
//         counter = await counterFactory.deploy();
//     });
//
//     describe("Deployment", function () {
//         it("Should test increment", async function () {
//             // Obtenir la valeur initiale du compteur
//             const initialValue: bigint = await counter.getCount();
//
//             // Appeler la fonction increment()
//             await counter.increment();
//
//             // Obtenir la valeur après l'incrémentation
//             const incrementedValue: bigint = await counter.getCount();
//             console.log(incrementedValue)
//             // Vérifier si la valeur a été correctement incrémentée
//             expect(incrementedValue).to.equal(1);
//         });
//     });
// });
import { expect } from "chai";
import { ethers } from "hardhat";
import { Counter, Counter__factory } from "../typechain-types";

describe("Counter", function () {
  let counter: Counter;

  beforeEach(async function () {
    const counterFactory: Counter__factory = await ethers.getContractFactory("Counter");
    counter = await counterFactory.deploy();
  });

  describe("Deployment", function () {
    it("Should test increment", async function () {
      await counter.increment();
      const incrementedValue = await counter.getCount();
      const incrementedValueBN = ethers.getBigInt(incrementedValue);
      let biginInit = 1
      expect(incrementedValueBN).to.equal(biginInit);
    });

    it("Should decrement count by 1", async function () {
      await counter.increment();
      await counter.increment();
      const initialValue = await counter.getCount();
      await counter.decrement();
      const decrementedValue = await counter.getCount();
      let biginInit = 1
      expect(decrementedValue).to.equal(biginInit);
    });

    it("Should not decrement count below zero", async function () {
      await expect(counter.decrement()).to.be.revertedWith("Counter: count cannot be negative");
      const valueAfterFailedDecrement = await counter.getCount();
      expect(valueAfterFailedDecrement).to.equal(0);
    });

  });
});
