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

  let InformationSource;
  let informationsource;


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

    InformationSource = await ethers.getContractFactory("InformationSource");
    informationsource = await InformationSource.deploy(
      "name",
      "url",
      "description",
      addr1.address
    );
    await connection.deployed();

  });

  // test that the contract stores its constructor parameters
  it("Has basic functionality", async function () {

    expect(await informationsource.name()).to.equal("name");
    expect(await informationsource.url()).to.equal("url");
    expect(await informationsource.description()).to.equal("description");
    expect(await informationsource.addr()).to.equal(addr1.address);

  });

  // test the methods which change the contract variables
  // setParent, setChild, setType
  // and test that they emit as expected
  it("Can change its values", async function () {

    /**
     * setName
     */

    // fail on not owner
    await expect(
      informationsource.connect(addr1).setName("new name")
    ).to.be.revertedWith("");

    // succeed and test emit
    await expect(informationsource.setName("new name"))
      .to.emit(informationsource, "InformationSourceUpdated")
      .withArgs("new name", "url", "description", addr1.address);

    expect(await informationsource.name()).to.equal("new name");


    /**
     * setUrl
     */

    // fail on not owner
    await expect(
      informationsource.connect(addr1).setUrl("new url")
    ).to.be.revertedWith("");

    // succeed and test emit
    await expect(informationsource.setUrl("new url"))
      .to.emit(informationsource, "InformationSourceUpdated")
      .withArgs("new name", "new url", "description", addr1.address);

    expect(await informationsource.url()).to.equal("new url");


    /**
     * setDescription
     */

    // fail on not owner
    await expect(
      informationsource.connect(addr1).setDescription("new description")
    ).to.be.revertedWith("");

    // succeed and test emit
    await expect(informationsource.setDescription("new description"))
      .to.emit(informationsource, "InformationSourceUpdated")
      .withArgs("new name", "new url", "new description", addr1.address);

    expect(await informationsource.description()).to.equal("new description");


    /**
     * setAddress
     */

    // fail on not owner
    await expect(
      informationsource.connect(addr1).setAddress(addr2.address)
    ).to.be.revertedWith("");

    // succeed and test emit
    await expect(informationsource.setAddress(addr2.address))
      .to.emit(informationsource, "InformationSourceUpdated")
      .withArgs("new name", "new url", "new description", addr2.address);

    expect(await informationsource.addr()).to.equal(addr2.address);

  });

});
