const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Idea", function () {

  let Idea;
  let idea;
  let owner;
  let addr1;
  let addr2;
  let addrs;


  beforeEach('', async () => {

    Idea = await ethers.getContractFactory("Idea");
    [owner, addr1, addr2, ...addrs] = await ethers.getSigners();
    idea = await Idea.deploy("Hello, world!");
    await idea.deployed();

  });

  it("Stores text", async function () {

    expect(await idea.text()).to.equal("Hello, world!");

  });

  // test the method which changes the contract variable
  // setText
  // and test that it emits as expected
  it("Can change its values", async function () {


    /**
     * setText
     */

    // fail on no text sent
    await expect(
      idea.setText("")
    ).to.be.revertedWith("An idea must have text");

    // fail when not the owner
    await expect(
      idea.connect(addr1).setText("New world! bad update - wrong owner")
    ).to.be.revertedWith("");

    // succeed and emit
    await expect(idea.setText("New world!"))
      .to.emit(idea, "IdeaUpdated")
      .withArgs("New world!");

    expect(await idea.text()).to.equal("New world!");

  });

});
