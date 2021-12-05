const { expect } = require("chai");
const { parseUnits, getAddress } = require("ethers").utils;
const { AddressZero } = require("ethers").constants;

describe("SecretSanta - Large Claiming", async function () {
  let rs = null;
  let ss = null;
  let owner = null;
  let accounts = null;
  let dc = null;

  beforeEach(async () => {
    const RagingSantas = await hre.ethers.getContractFactory("RagingSantas");
    accounts = await hre.ethers.getSigners();
    [owner] = accounts;

    const numSupply = accounts.length;
    rs = await RagingSantas.deploy(numSupply);
    rs.connect(owner).setProvHashMint('abcdef');
    rs.connect(owner).setProvHashMatch('012345');

    const DummyCollection = await hre.ethers.getContractFactory(
      "DummyCollection"
    );
    dc = await DummyCollection.deploy("Dummy", "DUM");

    for(let i = 1; i < accounts.length; i++) {
      console.log(i-1, accounts[i].address);
      await dc.connect(accounts[i]).mint(accounts[i].address);
      dc.connect(accounts[i]).approve(rs.address, i-1);
    }

    await rs.connect(owner).activateMint();

    for(let i = 1; i < accounts.length; i++) {
      await rs.connect(accounts[i]).mint(1, [dc.address], [i-1], {
        from: accounts[i].address,
        value: parseUnits(".03", "ether")
      });
    }
  });

  it("everyone claims", async () => {
    const rn = 17261481202;
    await rs.connect(owner).activateClaim(rn);

    for(let i = 1; i < accounts.length; i++) {
      await rs.connect(accounts[i])["claimGifts(uint256[])"]([i-1]);

      let giftGetting = await rs.getGiftByGifteeToken(i-1);
      console.log('TokenId', i-1, 'GETTING GIFT FROM TokenId ', giftGetting.gifterTokenId.toString());
      expect(await dc.ownerOf(giftGetting.nftTokenId)).to.equal(accounts[i].address);
      expect(giftGetting.giftee).to.equal(accounts[i].address);

      let giftGave = await rs.getGiftByGifterToken(giftGetting.gifterTokenId);
      expect(giftGave.nftTokenId).to.equal(giftGetting.nftTokenId);
      expect(giftGave.giftee).to.equal(accounts[i].address);
    }
  });
});
