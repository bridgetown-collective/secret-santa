const SecretSanta = artifacts.require("SecretSanta");

const { web3 } = SecretSanta;

contract("SecretSanta - registration", (accounts) => {
  const [owner] = accounts;

  let ss = null;

  beforeEach(async () => {
    ss = await SecretSanta.new();
  });

  it("should be deployable and set the owner", async () => {
    assert.equal(await ss.owner(), owner);
    assert.notEqual(await ss.owner(), accounts[1]);
    assert.equal(await ss.isRegistrationOpen(), true);
  });

  it("should allow registration, when open", async () => {
    assert.equal(await ss.isRegistrationOpen(), true);

    await ss.register({ from: accounts[1] });
    await ss.register({ from: accounts[2] });
    assert.equal(await ss.getParticipantCount(), 2);

    await ss.closeRegistration({ from: owner });
    assert.equal(await ss.isRegistrationOpen(), false);

    let err = null;
    try {
      await ss.register({ from: accounts[3] });
    } catch (error) {
      err = error;
    }
    assert.notEqual(err, null);
    assert.equal(await ss.getParticipantCount(), 2);

    await ss.openRegistration({ from: owner });
    assert.equal(await ss.isRegistrationOpen(), true);

    await ss.register({ from: accounts[3] });
    assert.equal(await ss.getParticipantCount(), 3);
  });

  it("should prevent duplicate registration", async () => {
    await ss.register({ from: accounts[1] });
    assert.equal(await ss.getParticipantCount(), 1);

    let err = null;
    try {
      await ss.register({ from: accounts[1] });
    } catch (error) {
      err = error;
    }
    assert.notEqual(err, null);
    assert.equal(await ss.getParticipantCount(), 1);
  });
});
