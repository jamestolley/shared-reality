const { expect } = require("chai");
const { ethers } = require("hardhat");



describe("Reference", function () {

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

  let Reference;
  let reference;


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

    Reference = await ethers.getContractFactory("Reference");
    reference = await Reference.deploy(
      parent_idea.address,
      "snippet",
      "url",
      addrs[0].address, // claimant
      addrs[1].address, // reporter
      addrs[2].address, // publisher
      1, // datetime as uint256
      "notes"
    );
    await connection.deployed();

  });

  // test that the contract stores its constructor parameters
  it("Has basic functionality", async function () {

    expect(await reference.idea()).to.equal(parent_idea.address);
    expect(await reference.snippet()).to.equal("snippet");
    expect(await reference.url()).to.equal("url");
    expect(await reference.claimant()).to.equal(addrs[0].address);
    expect(await reference.reporter()).to.equal(addrs[1].address);
    expect(await reference.publisher()).to.equal(addrs[2].address);
    expect(await reference.date_asserted()).to.equal(1);
    expect(await reference.notes()).to.equal("notes");

  });

  // test the methods which change the contract variables
  // setParent, setChild, setType
  // and test that they emit as expected
  it("Can change its values", async function () {

    /**
     * setIdea
     */

    console.log("      setIdea");

    // fail on not owner
    await expect(
      reference.connect(addr1).setIdea(child_idea.address)
    ).to.be.revertedWith("");

    // succeed and test emit
    await expect(reference.setIdea(child_idea.address))
      .to.emit(reference, "ReferenceUpdated")
      .withArgs(
        child_idea.address,
        "snippet",
        "url",
        addrs[0].address,
        addrs[1].address,
        addrs[2].address,
        1,
        "notes"
      );

    expect(await reference.idea()).to.equal(child_idea.address);


    /**
     * setSnippet
     */

    console.log("      setSnippet");

    // fail on not owner
    await expect(
      reference.connect(addr1).setSnippet("new snippet")
    ).to.be.revertedWith("");

    // succeed and test emit
    await expect(reference.setSnippet("new snippet"))
      .to.emit(reference, "ReferenceUpdated")
      .withArgs(
        child_idea.address,
        "new snippet",
        "url",
        addrs[0].address,
        addrs[1].address,
        addrs[2].address,
        1,
        "notes"
      );

    expect(await reference.snippet()).to.equal("new snippet");


    /**
     * setUrl
     */

    console.log("      setUrl");

    // fail on not owner
    await expect(
      reference.connect(addr1).setUrl("new url")
    ).to.be.revertedWith("");

    // succeed and test emit
    await expect(reference.setUrl("new url"))
      .to.emit(reference, "ReferenceUpdated")
      .withArgs(
        child_idea.address,
        "new snippet",
        "new url",
        addrs[0].address,
        addrs[1].address,
        addrs[2].address,
        1,
        "notes"
      );

    expect(await reference.url()).to.equal("new url");


    /**
     * setClaimant
     */

    console.log("      setClaimant");

    // fail on not owner
    await expect(
      reference.connect(addr1).setClaimant(addrs[3].address)
    ).to.be.revertedWith("");

    // succeed and test emit
    await expect(reference.setClaimant(addrs[3].address))
      .to.emit(reference, "ReferenceUpdated")
      .withArgs(
        child_idea.address,
        "new snippet",
        "new url",
        addrs[3].address,
        addrs[1].address,
        addrs[2].address,
        1,
        "notes"
      );

    expect(await reference.claimant()).to.equal(addrs[3].address);


    /**
     * setReporter
     */

    console.log("      setReporter");

    // fail on not owner
    await expect(
      reference.connect(addr1).setReporter(addrs[4].address)
    ).to.be.revertedWith("");

    // succeed and test emit
    await expect(reference.setReporter(addrs[4].address))
      .to.emit(reference, "ReferenceUpdated")
      .withArgs(
        child_idea.address,
        "new snippet",
        "new url",
        addrs[3].address,
        addrs[4].address,
        addrs[2].address,
        1,
        "notes"
      );

    expect(await reference.reporter()).to.equal(addrs[4].address);


    /**
     * setPublisher
     */

    console.log("      setPublisher");

    // fail on not owner
    await expect(
      reference.connect(addr1).setPublisher(addrs[5].address)
    ).to.be.revertedWith("");

    // succeed and test emit
    await expect(reference.setPublisher(addrs[5].address))
      .to.emit(reference, "ReferenceUpdated")
      .withArgs(
        child_idea.address,
        "new snippet",
        "new url",
        addrs[3].address,
        addrs[4].address,
        addrs[5].address,
        1,
        "notes"
      );

    expect(await reference.publisher()).to.equal(addrs[5].address);


    /**
     * setDateAsserted
     */

    console.log("      setDateAsserted");

    // fail on not owner
    await expect(
      reference.connect(addr1).setDateAsserted(2)
    ).to.be.revertedWith("");

    // succeed and test emit
    await expect(reference.setDateAsserted(2))
      .to.emit(reference, "ReferenceUpdated")
      .withArgs(
        child_idea.address,
        "new snippet",
        "new url",
        addrs[3].address,
        addrs[4].address,
        addrs[5].address,
        2,
        "notes"
      );

    expect(await reference.date_asserted()).to.equal(2);


    /**
     * setNotes
     */

    console.log("      setNotes");

    // fail on not owner
    await expect(
      reference.connect(addr1).setNotes("new notes")
    ).to.be.revertedWith("");

    // succeed and test emit
    await expect(reference.setNotes("new notes"))
      .to.emit(reference, "ReferenceUpdated")
      .withArgs(
        child_idea.address,
        "new snippet",
        "new url",
        addrs[3].address,
        addrs[4].address,
        addrs[5].address,
        2,
        "new notes"
      );

    expect(await reference.notes()).to.equal("new notes");

  });

});
