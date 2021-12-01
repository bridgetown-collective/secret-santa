const { expect } = require("chai");
const { parseUnits, getAddress } = require("ethers").utils;
const { AddressZero } = require("ethers").constants;

describe("SecretSanta - Claiming", async function () {
  let rs = null;
  let ss = null;
  let owner = null;
  let accounts = null;
  let dc = null;

  beforeEach(async () => {
    const RagingSantas = await hre.ethers.getContractFactory("RagingSantas");
    accounts = await hre.ethers.getSigners();
    [owner] = accounts;

    const numSupply = 4;
    const numReserve = 0;
    rs = await RagingSantas.deploy(numSupply, numReserve);

    const DummyCollection = await hre.ethers.getContractFactory(
      "DummyCollection"
    );
    dc = await DummyCollection.deploy("Dummy", "DUM");

    await dc.connect(accounts[1]).mint(accounts[1].address);
    await dc.connect(accounts[2]).mint(accounts[2].address);

    // Approve RagingSanta for gifting this token (to happen in webUI)
    dc.connect(accounts[1]).approve(rs.address, 0);
    dc.connect(accounts[2]).approve(rs.address, 1);

    await rs.connect(owner).activateMint();
    await rs.connect(accounts[1]).mint(1, [dc.address], [0], {
      from: accounts[1].address,
      value: parseUnits(".03", "ether")
    });
    await rs.connect(accounts[2]).mint(1, [dc.address], [1], {
      from: accounts[2].address,
      value: parseUnits(".03", "ether")
    });
  });

  it("should not allow claiming until activateClaim is flipped", async () => {
    // Verify rs account owns the dummy collection gifts now
    expect(rs.address).to.equal(await dc.ownerOf(0));
    expect(rs.address).to.equal(await dc.ownerOf(1));

    console.log("rs contract address", rs.address);
    console.log("dc contract address", dc.address);
    console.log("accounts[1]", accounts[1].address);
    console.log("accounts[2]", accounts[2].address);

    // Verify accounts hold the raging santas
    expect(await rs.ownerOf(0)).to.equal(accounts[1].address);
    expect(await rs.ownerOf(1)).to.equal(accounts[2].address);

    await expect(
      rs.connect(accounts[1])["claimGifts(uint256[])"]([0])
    ).to.be.revertedWith(
      "VM Exception while processing transaction: reverted with reason string 'Claim: Claiming Period has not started yet!'"
    );

    await rs.connect(owner).activateClaim();
    await rs.connect(accounts[1])["claimGifts(uint256[])"]([0]);

    expect(accounts[1].address).to.equal(await dc.ownerOf(1));
  });

  it("should let someone claim a gift that is not their own", async () => {
    // Verify rs account owns the dummy collection gifts now
    expect(rs.address).to.equal(await dc.ownerOf(0));
    expect(rs.address).to.equal(await dc.ownerOf(1));

    // Verify accounts hold the raging santas
    expect(await rs.ownerOf(0)).to.equal(accounts[1].address);
    expect(await rs.ownerOf(1)).to.equal(accounts[2].address);

    await rs.connect(owner).activateClaim();
    await rs.connect(accounts[1])["claimGifts(uint256[])"]([0]);

    expect(accounts[1].address).to.not.equal(await dc.ownerOf(0));
    expect(accounts[1].address).to.equal(await dc.ownerOf(1));
  });

  it("should not let someone claim a gift for a token that has already claimed", async () => {
    await rs.connect(owner).activateClaim();
    await rs.connect(accounts[1])["claimGifts(uint256[])"]([0]);

    expect(accounts[1].address).to.not.equal(await dc.ownerOf(0));
    expect(accounts[1].address).to.equal(await dc.ownerOf(1));

    expect(await dc.ownerOf(0)).to.not.equal(accounts[1].address);
    expect(await dc.ownerOf(1)).to.equal(accounts[1].address);

    await expect(
      rs.connect(accounts[1])["claimGifts(uint256[])"]([0])
    ).to.be.revertedWith(
      "VM Exception while processing transaction: reverted with reason string 'Claim: Gift has already been claimed'"
    );
  });

  it("should let someone send their gift to a wallet of choice", async () => {
    expect([await dc.ownerOf(0), await dc.ownerOf(1)]).to.not.contain(
      accounts[3].address
    );

    await rs.connect(owner).activateClaim();
    await rs
      .connect(accounts[1])
      ["claimGifts(uint256[],address)"]([0], accounts[3].address);

    expect(accounts[1].address).to.not.equal(await dc.ownerOf(0));
    expect(accounts[1].address).to.not.equal(await dc.ownerOf(1));
    expect([await dc.ownerOf(0), await dc.ownerOf(1)]).to.contain(
      accounts[3].address
    );
  });

  it("should keep giftpool up to date upon claim", async () => {
    expect([await dc.ownerOf(0), await dc.ownerOf(1)]).to.not.contain(
      accounts[3].address
    );

    let giftInPoolToken = Number((await rs.giftPoolTokens(0)).toString())
    expect(giftInPoolToken).to.equal(0)

    let gift = await rs.getGiftByProviderToken(giftInPoolToken);
    expect(gift.nftAddress).to.equal(dc.address);
    expect(gift.nftTokenId).to.equal(0);
    expect(gift.gifter).to.equal(accounts[1].address);
    expect(gift.giftee).to.equal(AddressZero);
    expect(gift.gifteeDelegator).to.equal(AddressZero);

    await rs.connect(owner).activateClaim();
    await rs
      .connect(accounts[1])
      ["claimGifts(uint256[])"]([0])

    expect(accounts[1].address).to.not.equal(await dc.ownerOf(0));
    expect(accounts[1].address).to.equal(await dc.ownerOf(1));
    expect([await dc.ownerOf(0), await dc.ownerOf(1)]).to.contain(
      accounts[1].address
    );

    // this is not determinstic - bc its a delegator theres a 50/50 chance
    giftInPoolToken = Number((await rs.giftPoolTokens(0)).toString())
    expect(giftInPoolToken).to.equal(0)

    gift = await rs.getGiftByProviderToken(giftInPoolToken);
    expect(gift.nftAddress).to.equal(dc.address);
    expect(gift.nftTokenId).to.equal(0);
    expect(gift.gifter).to.equal(accounts[1].address);
    expect(gift.giftee).to.equal(AddressZero);
    expect(gift.gifteeDelegator).to.equal(AddressZero);

    /// TODOOO
  });
});
