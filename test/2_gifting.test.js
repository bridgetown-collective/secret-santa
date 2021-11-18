const SecretSanta = artifacts.require("SecretSanta");

const { web3 } = SecretSanta;

contract("SecretSanta - gifting", (accounts) => {
  const [owner] = accounts;

  let ss = null;

  beforeEach(async () => {
    ss = await SecretSanta.new();
  });

  it("should allow a participant to see their giftee once registration is closed", async () => {
    await ss.register({ from: accounts[1] });
    await ss.register({ from: accounts[2] });
    assert.equal(await ss.getParticipantCount(), 2);

    let err = null;
    try {
      await ss.getAssignedGiftee({ from: accounts[1] });
    } catch (error) {
      err = error;
    }
    assert.notEqual(err, null);

    await ss.closeRegistration({ from: owner });

    assert.equal(
      await ss.getAssignedGiftee({ from: accounts[1] }),
      accounts[2]
    );
    assert.equal(
      await ss.getAssignedGiftee({ from: accounts[2] }),
      accounts[1]
    );

    err = null;
    try {
      await ss.getAssignedGiftee({ from: accounts[3] });
    } catch (error) {
      err = error;
    }
    assert.notEqual(err, null);
  });
});
