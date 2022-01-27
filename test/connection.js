const { expect } = require("chai");
const { ethers } = require("hardhat");



describe("Connection", function () {

  let Connection;
  let connection;
  let Idea;
  let parent_idea;
  let parent_idea2;
  let child_idea;
  let child_idea2;
  let owner;
  let addr1;
  let addr2;
  let addrs;


  // `beforeEach` will run before each test, re-deploying the contract every
  // time. It receives a callback, which can be async.
  beforeEach(async function () {

    Idea = await ethers.getContractFactory("Idea");
    [owner, addr1, addr2, ...addrs] = await ethers.getSigners();

    parent_idea = await Idea.deploy("Hello, world!");
    await parent_idea.deployed();

    parent_idea2 = await Idea.deploy("Hello, world! (parent 2)");
    await parent_idea2.deployed();

    child_idea = await Idea.deploy("Hello, world 2!");
    await child_idea.deployed();

    child_idea2 = await Idea.deploy("Hello, world 2! (child 2)");
    await child_idea2.deployed();

    Connection = await ethers.getContractFactory("Connection");
    connection = await Connection.deploy(
      parent_idea.address,
      child_idea.address,
      1 // objection?
    );
    await connection.deployed();

  });

  // test that the contract stores its constructor parameters
  it("Has basic functionality", async function () {

    expect(await connection.parent()).to.equal(parent_idea.address);
    expect(await connection.child()).to.equal(child_idea.address);
    expect(await connection.connection_type()).to.equal(1);

  });

  // test the methods which change the contract variables
  // setParent, setChild, setType
  // and test that they emit as expected
  it("Can change its values", async function () {

    /**
     * setParent
     */

    // fail on not owner
    await expect(
      connection.connect(addr1).setParent(parent_idea2.address)
    ).to.be.revertedWith("");

    // succeed and test emit
    await expect(connection.setParent(parent_idea2.address))
      .to.emit(connection, "ConnectionUpdated")
      .withArgs(
        parent_idea2.address,
        child_idea.address,
        1
      );

    expect(await connection.parent()).to.equal(parent_idea2.address);


    /**
     * setChild
     */

    // fail on not owner
    await expect(
      connection.connect(addr1).setChild(child_idea2.address)
    ).to.be.revertedWith("");

    // succeed and test emit
    await expect(connection.setChild(child_idea2.address))
      .to.emit(connection, "ConnectionUpdated")
      .withArgs(
        parent_idea2.address,
        child_idea2.address,
        1
      );

    expect(await connection.child()).to.equal(child_idea2.address);


    /**
     * setConnectionType
     */

    // fail on not owner
    await expect(
      connection.connect(addr1).setConnectionType(2)
    ).to.be.revertedWith("");

    // succeed and test emit
    await expect(connection.setConnectionType(2))
      .to.emit(connection, "ConnectionUpdated")
      .withArgs(
        parent_idea2.address,
        child_idea2.address,
        2
      );

    expect(await connection.connection_type()).to.equal(2);

  });

});
