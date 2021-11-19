const { expect } = require("chai");

describe("SecretSanta - gifting", async () => {
  let ss = null;
  let owner = null;
  let accounts = null;

  beforeEach(async () => {
    const SecretSanta = await hre.ethers.getContractFactory("SecretSanta");
    accounts = await hre.ethers.getSigners();
    [owner] = accounts;
    ss = await SecretSanta.deploy();
  });

  it("should allow a participant to see their giftee once registration is closed", async () => {
    await ss.connect(accounts[1]).register();
    await ss.connect(accounts[2]).register();
    expect(await ss.getParticipantCount()).to.equal(2);

    let err = null;
    try {
      await ss.connect(accounts[1]).getAssignedGiftee();
    } catch (error) {
      err = error;
    }
    expect(err).to.not.equal(null);

    await ss.connect(owner).closeRegistration();

    expect(await ss.connect(accounts[1]).getAssignedGiftee()).to.equal(
      accounts[2].address
    );
    expect(await ss.connect(accounts[2]).getAssignedGiftee()).to.equal(
      accounts[1].address
    );

    err = null;
    try {
      await ss.connect(accounts[3]).getAssignedGiftee();
    } catch (error) {
      err = error;
    }
    expect(err).to.not.equal(null);
  });
});
