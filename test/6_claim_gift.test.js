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
    const freeMints = 0;
    rs = await RagingSantas.deploy(numSupply, freeMints);

    const DummyCollection = await hre.ethers.getContractFactory(
      "DummyCollection"
    );
    dc = await DummyCollection.deploy("Dummy", "DUM");

    console.log("rs contract address", rs.address);
    console.log("dc contract address", dc.address);

    await dc.connect(accounts[1]).mint(accounts[1].address);
    await dc.connect(accounts[2]).mint(accounts[2].address);

    // Approve RagingSanta for gifting this token (to happen in webUI)
    dc.connect(accounts[1]).approve(rs.address, 0);
    dc.connect(accounts[2]).approve(rs.address, 1);

    await rs.connect(owner).activateMint();
    await rs.connect(accounts[1]).mint(dc.address, 0, {
      from: accounts[1].address,
      value: parseUnits(".03", "ether"),
    });
    await rs.connect(accounts[2]).mint(dc.address, 1, {
      from: accounts[2].address,
      value: parseUnits(".03", "ether"),
    });
    console.log("accounts[1]", accounts[1].address, "gifted dc:0");
    console.log("accounts[2]", accounts[2].address, "gifted dc:1");
  });

  it("should not allow claiming until activateClaim is flipped", async () => {
    // Verify rs account owns the dummy collection gifts now
    expect(rs.address).to.equal(await dc.ownerOf(0));
    expect(rs.address).to.equal(await dc.ownerOf(1));

    // Verify accounts hold the raging santas
    expect(await rs.ownerOf(0)).to.equal(accounts[1].address);
    expect(await rs.ownerOf(1)).to.equal(accounts[2].address);

    await expect(
      rs.connect(accounts[1])["claimGifts(uint256[])"]([0])
    ).to.be.revertedWith(
      "VM Exception while processing transaction: reverted with reason string 'ClaimDisabled'"
    );

    const rn_seed = 456123789;
    await rs.connect(owner).activateClaim(rn_seed);
    await rs.connect(accounts[1])["claimGifts(uint256[])"]([0]);

    let gift = await rs.getGiftByGifteeToken(0);
    console.log(gift);

    expect(accounts[1].address).to.equal(await dc.ownerOf(1));
    expect(gift.nftAddress).to.equal(dc.address);
    expect(gift.nftTokenId).to.equal("1");
    expect(gift.gifterTokenId).to.equal("1");
    expect(gift.gifteeTokenId).to.equal("0");
    expect(gift.gifter).to.equal(accounts[2].address);
    expect(gift.giftee).to.equal(accounts[1].address);
    expect(gift.gifteeDelgator).to.equal(undefined);
    expect(gift.hasClaimed).to.equal(true);
  });

  it("should shuffle correctly", async () => {
    const rn_seed = 456123789;
    await rs.connect(owner).activateClaim(rn_seed);

    let giftIGave = await rs.getGiftByGifterToken(0);
    console.log(giftIGave);

    let giftIWillGet = await rs.getGiftByGifteeToken(0);
    console.log(giftIWillGet);

    expect(rs.address).to.equal(await dc.ownerOf(1));
    expect(giftIWillGet.nftAddress).to.equal(dc.address);
    expect(giftIWillGet.nftTokenId).to.equal("1");
    expect(giftIWillGet.gifterTokenId).to.equal("1");
    expect(giftIWillGet.gifteeTokenId).to.equal("0");
    expect(giftIWillGet.gifter).to.equal(accounts[2].address);
    expect(giftIWillGet.giftee).to.equal(AddressZero);
    expect(giftIWillGet.gifteeDelgator).to.equal(undefined);
    expect(giftIWillGet.hasClaimed).to.equal(false);
  });

  it("should let someone claim a gift that is not their own", async () => {
    const rn_seed = 456123789;
    await rs.connect(owner).activateClaim(rn_seed);
    await rs.connect(accounts[1])["claimGifts(uint256[])"]([0]);

    expect(accounts[1].address).to.not.equal(await dc.ownerOf(0));
    expect(accounts[1].address).to.equal(await dc.ownerOf(1));
  });

  it("should not let someone claim a gift for a token that has already claimed", async () => {
    const rn_seed = 456123789;
    await rs.connect(owner).activateClaim(rn_seed);
    await rs.connect(accounts[1])["claimGifts(uint256[])"]([0]);

    expect(accounts[1].address).to.not.equal(await dc.ownerOf(0));
    expect(accounts[1].address).to.equal(await dc.ownerOf(1));

    expect(await dc.ownerOf(0)).to.not.equal(accounts[1].address);
    expect(await dc.ownerOf(1)).to.equal(accounts[1].address);

    await expect(
      rs.connect(accounts[1])["claimGifts(uint256[])"]([0])
    ).to.be.revertedWith(
      "VM Exception while processing transaction: reverted with reason string 'GiftClaimed'"
    );
  });

  it("should not let someone claim a gift for a token they arent the owner of", async () => {
    const rn_seed = 456123789;
    await rs.connect(owner).activateClaim(rn_seed);

    await expect(
      rs.connect(accounts[1])["claimGifts(uint256[])"]([1])
    ).to.be.revertedWith(
      "VM Exception while processing transaction: reverted with reason string 'NotOwner'"
    );
  });

  it("should not let someone claim a gift if they dont provide tokens", async () => {
    const rn_seed = 456123789;
    await rs.connect(owner).activateClaim(rn_seed);

    await expect(
      rs.connect(accounts[1])["claimGifts(uint256[])"]([])
    ).to.be.revertedWith(
      "VM Exception while processing transaction: reverted with reason string 'NoTokens'"
    );
  });

  describe("upon claims", async () => {
    it("should keep giftpool up to date upon claim", async () => {
      expect([await dc.ownerOf(0), await dc.ownerOf(1)]).to.not.contain(
        accounts[3].address
      );

      let numGiftsLeft = Number((await rs.numGiftsLeft()).toString());
      expect(numGiftsLeft).to.equal(2);

      const rn_seed = 456123789;
      await rs.connect(owner).activateClaim(rn_seed);

      let giftIGave = await rs.getGiftByGifterToken(0);
      console.log(giftIGave);

      expect(rs.address).to.equal(await dc.ownerOf(0));
      expect(giftIGave.nftAddress).to.equal(dc.address);
      expect(giftIGave.nftTokenId).to.equal("0");
      expect(giftIGave.gifterTokenId).to.equal("0");
      expect(giftIGave.gifteeTokenId).to.equal("1");
      expect(giftIGave.gifter).to.equal(accounts[1].address);
      expect(giftIGave.giftee).to.equal(AddressZero);
      expect(giftIGave.gifteeDelgator).to.equal(undefined);
      expect(giftIGave.hasClaimed).to.equal(false);

      await rs.connect(accounts[1])["claimGifts(uint256[])"]([0]);

      expect(accounts[1].address).to.not.equal(await dc.ownerOf(0));
      expect(accounts[1].address).to.equal(await dc.ownerOf(1));
      numGiftsLeft = Number((await rs.numGiftsLeft()).toString());
      expect(numGiftsLeft).to.equal(1);

      let giftIGet = await rs.getGiftByGifteeToken(0);
      console.log(giftIGet);

      expect(accounts[1].address).to.equal(await dc.ownerOf(1));
      expect(giftIGet.nftAddress).to.equal(dc.address);
      expect(giftIGet.nftTokenId).to.equal("1");
      expect(giftIGet.gifterTokenId).to.equal("1");
      expect(giftIGet.gifteeTokenId).to.equal("0");
      expect(giftIGet.gifter).to.equal(accounts[2].address);
      expect(giftIGet.giftee).to.equal(accounts[1].address);
      expect(giftIGet.gifteeDelgator).to.equal(undefined);
      expect(giftIGet.hasClaimed).to.equal(true);

      let otherGift = await rs.getGiftByGifteeToken(1);
      console.log(otherGift);

      expect(rs.address).to.equal(await dc.ownerOf(0));
      expect(otherGift.nftAddress).to.equal(dc.address);
      expect(otherGift.nftTokenId).to.equal("0");
      expect(otherGift.gifterTokenId).to.equal("0");
      expect(otherGift.gifteeTokenId).to.equal("1");
      expect(otherGift.gifter).to.equal(accounts[1].address);
      expect(otherGift.giftee).to.equal(AddressZero);
      expect(otherGift.gifteeDelgator).to.equal(undefined);
      expect(otherGift.hasClaimed).to.equal(false);
    });

    it("should allow for pausing / unpausing of claims", async () => {
      expect([await dc.ownerOf(0), await dc.ownerOf(1)]).to.not.contain(
        accounts[3].address
      );

      let numGiftsLeft = Number((await rs.numGiftsLeft()).toString());
      expect(numGiftsLeft).to.equal(2);

      const rn_seed = 4561289;
      await rs.connect(owner).activateClaim(rn_seed);

      await rs.connect(accounts[1])["claimGifts(uint256[])"]([0]);

      expect(accounts[1].address).to.not.equal(await dc.ownerOf(0));
      expect(accounts[1].address).to.equal(await dc.ownerOf(1));
      numGiftsLeft = Number((await rs.numGiftsLeft()).toString());
      expect(numGiftsLeft).to.equal(1);

      await rs.connect(owner).pauseClaim(true);

      await expect(
        rs.connect(accounts[2])["claimGifts(uint256[])"]([1])
      ).to.be.revertedWith(
        "VM Exception while processing transaction: reverted with reason string 'ClaimDisabled'"
      );

      await rs.connect(owner).pauseClaim(false);

      await rs.connect(accounts[2])["claimGifts(uint256[])"]([1]);

      expect(accounts[2].address).to.not.equal(await dc.ownerOf(1));
      expect(accounts[2].address).to.equal(await dc.ownerOf(0));
      numGiftsLeft = Number((await rs.numGiftsLeft()).toString());
      expect(numGiftsLeft).to.equal(0);
    });
  });
});
