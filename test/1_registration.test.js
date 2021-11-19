const { expect } = require("chai");

describe("SecretSanta - Registration", async function () {
  let ss = null;
  let owner = null;
  let accounts = null;

  beforeEach(async () => {
    const SecretSanta = await hre.ethers.getContractFactory("SecretSanta");
    accounts = await hre.ethers.getSigners();
    [owner] = accounts;
    ss = await SecretSanta.deploy();
  });

  it("should be deployable and set the owner", async () => {
    expect(await ss.owner()).to.equal(owner.address);
    expect(await ss.owner()).to.not.equal(accounts[1]);
    expect(await ss.isRegistrationOpen()).to.equal(true);
  });

  it("should allow registration, when open", async () => {
    expect(await ss.isRegistrationOpen()).to.equal(true);

    await ss.connect(accounts[1]).register();
    await ss.connect(accounts[2]).register();
    expect(await ss.getParticipantCount()).to.equal(2);
    console.log('get here');

    await ss.connect(owner).closeRegistration();
    expect(await ss.isRegistrationOpen()).to.equal(false);

    let err = null;
    try {
      await ss.connect(accounts[3]).register();
    } catch (error) {
      err = error;
    }
    expect(err).to.not.equal(null);
    expect(await ss.getParticipantCount()).to.equal(2);

    await ss.connect(owner).openRegistration();
    expect(await ss.isRegistrationOpen()).to.equal(true);

    await ss.connect(accounts[3]).register();
    expect(await ss.getParticipantCount()).to.equal(3);
  });

  it("should prevent duplicate registration", async () => {
    await ss.connect(accounts[1]).register();
    expect(await ss.getParticipantCount()).to.equal(1);

    let err = null;
    try {
      await ss.connect(accounts[1]).register();
    } catch (error) {
      err = error;
    }
    expect(err).to.not.equal(null);
    expect(await ss.getParticipantCount()).to.equal(1);
  });
});
