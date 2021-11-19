const { expect } = require("chai");

describe.only("SecretSanta - Registration", async function () {
  let rs = null;
  let ss = null;
  let owner = null;
  let accounts = null;

  beforeEach(async () => {
    const SecretSanta = await hre.ethers.getContractFactory("SecretSanta");
    const RagingSantas = await hre.ethers.getContractFactory("RagingSantas");
    accounts = await hre.ethers.getSigners();
    [owner] = accounts;
    ss = await SecretSanta.deploy();
    rs = await RagingSantas.deploy("RagingSantas", "SNTA")
  });

  it('should allow gifting', async () =>  {
    // acquire an NFT
    await rs.connect(accounts[1]).mint(accounts[1].address)
    expect(await rs.ownerOf(0)).to.equal(accounts[1].address)

    await ss.connect(accounts[1]).register();
    await ss.connect(accounts[2]).register();
    expect(await ss.getParticipantCount()).to.equal(2);

    await ss.connect(owner).closeRegistration();
    expect(await ss.isRegistrationOpen()).to.equal(false);

    console.log(rs.address)
    await ss.connect(accounts[1]).giftNFT(rs.address, 0);
    //expect(await rs.ownerOf(0)).to.equal(rs.address)
  })

});
