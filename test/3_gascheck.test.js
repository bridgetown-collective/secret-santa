const { expect } = require("chai");

describe.skip("SecretSanta - gas check", async () => {
  let ss = null;
  let owner = null;
  let accounts = null;

  beforeEach(async () => {
    const SecretSanta = await hre.ethers.getContractFactory("SecretSanta");
    accounts = await hre.ethers.getSigners();
    [owner] = accounts;
    ss = await SecretSanta.deploy();
  });

  it("should not cost an arm and a leg", async () => {
    const registerTx = await ss.connect(accounts[0]).register();
    let receipt = await registerTx.wait();
    console.log(`Gas used for "register": ${receipt.gasUsed}`);

    for (let i = 1; i < accounts.length; i += 1) {
      await ss.connect(accounts[i]).register();
    }

    const closeRegistrationTx = await ss
      .connect(accounts[0])
      .closeRegistration();
    receipt = await closeRegistrationTx.wait();
    console.log(
      `Gas used for "closeRegistration" after ${accounts.length} registrations: ${receipt.gasUsed}`
    );
  });
});
