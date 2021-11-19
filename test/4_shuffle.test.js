const { expect } = require("chai");

describe("SecretSanta", function () {
  it("Should Deploy And Shuffle", async function () {
    const SecretSanta  = await hre.ethers.getContractFactory("SecretSanta");
    const secretSanta = await SecretSanta.deploy();

    await secretSanta.deployed();
    const accounts = await hre.ethers.getSigners();

    for (const account of accounts) {
      const registerTx = await secretSanta.connect(account).register();
    }

    const closeRegistrationTx = await secretSanta.connect(accounts[0]).closeRegistration();

    const giftee1 = await secretSanta.getAssignedGiftee()
    expect(giftee1).to.not.equal(accounts[0].address)

    const giftee2 = await secretSanta.connect(giftee1).getAssignedGiftee()
    expect(giftee2).to.not.equal(accounts[0].address)
    expect(giftee2).to.not.equal(giftee1)
  });

  it("Accept Gifts", async function () {
    const SecretSanta  = await hre.ethers.getContractFactory("SecretSanta");
    const secretSanta = await SecretSanta.deploy();

    await secretSanta.deployed();
    const accounts = await hre.ethers.getSigners();

    for (const account of accounts) {
      const registerTx = await secretSanta.connect(account).register();
    }

    const closeRegistrationTx = await secretSanta.connect(accounts[0]).closeRegistration();

  });
});
