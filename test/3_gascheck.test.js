const SecretSanta = artifacts.require("SecretSanta");

const { web3 } = SecretSanta;

contract("SecretSanta - gas check", (accounts) => {
  it("should not cost an arm and a leg", async () => {
    // @TODO: define how much is too much
    const ss = await SecretSanta.deployed();

    const registerTx = await ss.register({ from: accounts[0] });
    console.log(`Gas used for "register": ${registerTx.receipt.gasUsed}`);

    for (let i = 1; i < accounts.length; i += 1) {
      await ss.register({ from: accounts[i] });
    }

    const closeRegistrationTx = await ss.closeRegistration({
      from: accounts[0],
      gasPrice: 0,
    });
    console.log(
      `Gas used for "closeRegistration" after ${accounts.length} registrations: ${closeRegistrationTx.receipt.gasUsed}`
    );
  });
});
