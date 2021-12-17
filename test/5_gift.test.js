const { expect } = require("chai");
const { parseUnits } = require("ethers").utils;
const { AddressZero } = require("ethers").constants;

async function expectTokenOwnedToBe(rs, address, expectedArr) {
  for (let i = 0; i < expectedArr.length; i++) {
    let ownerAdd = await rs.ownerOf(expectedArr[i]);
    expect(ownerAdd).to.equal(address);
  }
}

describe("RagingSantas - Minting", async function () {
  let rs = null;
  let ss = null;
  let owner = null;
  let accounts = null;

  beforeEach(async () => {
    const RagingSantas = await hre.ethers.getContractFactory("RagingSantas");
    accounts = await hre.ethers.getSigners();
    [owner] = accounts;
    const numSupply = 2;
    const numFreeMints = 0;
    rs = await RagingSantas.deploy(numSupply, numFreeMints);
  });

  it("should not allow minting if minting hasnt been activated", async () => {
    expect(await rs.mintActive()).to.equal(false);

    expect(rs.connect(accounts[1]).mint(1, [], [])).to.be.revertedWith(
      "VM Exception while processing transaction: reverted with reason string 'MintInactive'"
    );
  });

  it("should not allow minting if insufficient funds in ether", async () => {
    expect(await rs.mintActive()).to.equal(false);
    await rs.connect(accounts[0]).activateMint();
    expect(await rs.mintActive()).to.equal(true);

    // Just short of the 0.03 mint price
    await expect(
      rs.connect(accounts[1]).mint(1, [], [], {
        from: accounts[1].address,
        value: parseUnits(".0299", "ether")
      })
    ).to.be.revertedWith(
      "VM Exception while processing transaction: reverted with reason string 'InsufficientFunds'"
    );

    // Just short of 2 mints
    await expect(
      rs.connect(accounts[1]).mint(2, [], [], {
        from: accounts[1].address,
        value: parseUnits(".0599", "ether")
      })
    ).to.be.revertedWith(
      "VM Exception while processing transaction: reverted with reason string 'InsufficientFunds'"
    );

    const numMinted = await rs.numberMinted();
    expect(numMinted.toString()).to.equal("0");

    await expectTokenOwnedToBe(rs, accounts[1].address, []);
  });

  it("should not allow minting if insufficient entry fee gift", async () => {
    await rs.connect(accounts[0]).activateMint();
    await expect(
      rs.connect(accounts[1]).mint(1, [], [], {
        from: accounts[1].address,
        value: parseUnits(".03", "ether")
      })
    ).to.be.revertedWith(
      "VM Exception while processing transaction: reverted with reason string 'InvalidGift'"
    );
  });

  describe("assuming I have some nfts to gift", async () => {
    let dc;

    beforeEach(async () => {
      const DummyCollection = await hre.ethers.getContractFactory(
        "DummyCollection"
      );
      dc = await DummyCollection.deploy("Dummy", "DUM");
      await dc.connect(accounts[1]).mint(accounts[1].address);
      await dc.connect(accounts[2]).mint(accounts[2].address);
    });

    it("should not allow minting when gift parameters are invalid", async () => {
      // Verify account owns the first token of dummy collection
      expect(accounts[1].address).to.equal(await dc.ownerOf(0));

      // Approve RagingSanta for gifting this token (to happen in webUI)
      dc.connect(accounts[1]).approve(rs.address, 0);

      await rs.connect(accounts[0]).activateMint();

      await expect(
        rs.connect(accounts[1]).mint(2, [dc.address], [0], {
          from: accounts[1].address,
          value: parseUnits(".06", "ether")
        })
      ).to.be.revertedWith(
        "VM Exception while processing transaction: reverted with reason string 'InvalidGift'"
      );

      await expect(
        rs.connect(accounts[1]).mint(1, [dc.address], [0, 1], {
          from: accounts[1].address,
          value: parseUnits(".03", "ether")
        })
      ).to.be.revertedWith(
        "VM Exception while processing transaction: reverted with reason string 'InvalidGift'"
      );

      await expect(
        rs.connect(accounts[1]).mint(1, [dc.address, dc.address], [0], {
          from: accounts[1].address,
          value: parseUnits(".03", "ether")
        })
      ).to.be.revertedWith(
        "VM Exception while processing transaction: reverted with reason string 'InvalidGift'"
      );
    });

    it("should allow minting multiple", async () => {
      await dc.connect(accounts[1]).mint(accounts[1].address);
      await dc.connect(accounts[1]).approve(rs.address, 0);
      await dc.connect(accounts[1]).approve(rs.address, 2);

      await rs.connect(accounts[0]).activateMint();
      await rs.connect(accounts[1]).mint(2, [dc.address, dc.address], [0, 2], {
        from: accounts[1].address,
        value: parseUnits(".06", "ether")
      });

      const numMinted = await rs.numberMinted();
      expect(numMinted.toString()).to.equal("2");

      expect(await rs.ownerOf(0)).to.equal(accounts[1].address);
      expect(await rs.ownerOf(1)).to.equal(accounts[1].address);
      expect(await rs.numGiftsLeft()).to.equal(2);

      await expectTokenOwnedToBe(rs, accounts[0].address, []);
      await expectTokenOwnedToBe(rs, accounts[1].address, [0, 1]);
    });

    it("should allow minting if all conditions are met", async () => {
      // Verify account owns the first token of dummy collection
      expect(accounts[1].address).to.equal(await dc.ownerOf(0));
      expect(accounts[2].address).to.equal(await dc.ownerOf(1));

      // Approve RagingSanta for gifting this token (to happen in webUI)
      dc.connect(accounts[1]).approve(rs.address, 0);
      dc.connect(accounts[2]).approve(rs.address, 1);

      await rs.connect(accounts[0]).activateMint();

      await rs.connect(accounts[1]).mint(1, [dc.address], [0], {
        from: accounts[1].address,
        value: parseUnits(".03", "ether")
      });

      await rs.connect(accounts[2]).mint(1, [dc.address], [1], {
        from: accounts[2].address,
        value: parseUnits(".03", "ether")
      });

      expect(await rs.ownerOf(0)).to.equal(accounts[1].address);
      expect(await rs.ownerOf(1)).to.equal(accounts[2].address);

      await expectTokenOwnedToBe(rs, accounts[1].address, [0]);
      await expectTokenOwnedToBe(rs, accounts[2].address, [1]);
    });

    it("should keep giftpool up to date", async () => {
      // Verify account owns the first token of dummy collection
      expect(accounts[1].address).to.equal(await dc.ownerOf(0));
      expect(accounts[2].address).to.equal(await dc.ownerOf(1));

      // Approve RagingSanta for gifting this token (to happen in webUI)
      dc.connect(accounts[1]).approve(rs.address, 0);
      dc.connect(accounts[2]).approve(rs.address, 1);

      await rs.connect(accounts[0]).activateMint();

      await rs.connect(accounts[2]).mint(1, [dc.address], [1], {
        from: accounts[2].address,
        value: parseUnits(".03", "ether")
      });

      await rs.connect(accounts[1]).mint(1, [dc.address], [0], {
        from: accounts[1].address,
        value: parseUnits(".03", "ether")
      });

      await expectTokenOwnedToBe(rs, accounts[2].address, [0]);
      await expectTokenOwnedToBe(rs, accounts[1].address, [1]);

      let gift = await rs.getGiftByGifterToken(0);
      expect(gift.nftAddress).to.equal(dc.address);
      expect(gift.nftTokenId).to.equal(1);
      expect(gift.gifter).to.equal(accounts[2].address);
      expect(gift.giftee).to.equal(AddressZero);
      expect(gift.hasClaimed).to.equal(false);

      gift = await rs.getGiftByGifterToken(1);
      expect(gift.nftAddress).to.equal(dc.address);
      expect(gift.nftTokenId).to.equal(0);
      expect(gift.gifter).to.equal(accounts[1].address);
      expect(gift.giftee).to.equal(AddressZero);
      expect(gift.hasClaimed).to.equal(false);

      await expect(rs.getGiftByGifterToken(2)).to.be.revertedWith(
        "VM Exception while processing transaction: reverted with reason string 'ERC721: owner query for nonexistent token'"
      );
    });
  });
});

describe("SecretSanta - FreeMinting", async function () {
  let rs = null;
  let ss = null;
  let owner = null;
  let accounts = null;

  beforeEach(async () => {
    const RagingSantas = await hre.ethers.getContractFactory("RagingSantas");
    accounts = await hre.ethers.getSigners();
    [owner] = accounts;
    const numSupply = 5;
    const numFreeMints = 3;
    rs = await RagingSantas.deploy(numSupply, numFreeMints);
  });

  it("not accept invalid gift parameters", async () => {
    expect(await rs.mintActive()).to.equal(false);
    await rs.connect(accounts[0]).activateMint();
    expect(await rs.mintActive()).to.equal(true);

    await expect(
      rs.connect(accounts[1]).mint(1, [], [], {
        from: accounts[1].address,
        value: parseUnits("0", "ether")
      })
    ).to.be.revertedWith(
      "VM Exception while processing transaction: reverted with reason string 'InvalidGift'"
    );

    const numMinted = await rs.numberMinted();
    expect(numMinted.toString()).to.equal("0");
    await expectTokenOwnedToBe(rs, accounts[1].address, []);
  });

  describe("assuming I have some nfts to gift", async () => {
    let dc;

    beforeEach(async () => {
      const DummyCollection = await hre.ethers.getContractFactory(
        "DummyCollection"
      );
      dc = await DummyCollection.deploy("Dummy", "DUM");
      await dc.connect(accounts[1]).mint(accounts[1].address);
      await dc.connect(accounts[2]).mint(accounts[2].address);
    });

    it("should allow minting for free", async () => {
      await dc.connect(accounts[1]).mint(accounts[1].address);
      await dc.connect(accounts[1]).approve(rs.address, 0);
      await dc.connect(accounts[1]).approve(rs.address, 2);

      await rs.connect(accounts[0]).activateMint();
      await rs.connect(accounts[1]).mint(2, [dc.address, dc.address], [0, 2], {
        from: accounts[1].address,
        value: parseUnits("0", "ether")
      });

      const numMinted = await rs.numberMinted();
      expect(numMinted.toString()).to.equal("2");

      expect(await rs.ownerOf(0)).to.equal(accounts[1].address);
      expect(await rs.ownerOf(1)).to.equal(accounts[1].address);
      expect(await rs.numGiftsLeft()).to.equal(2);

      await expectTokenOwnedToBe(rs, accounts[0].address, []);
      await expectTokenOwnedToBe(rs, accounts[1].address, [0, 1]);
    });

    it("should use regular mint price once num free gifts exhausted", async () => {
      await dc.connect(accounts[1]).mint(accounts[1].address);
      await dc.connect(accounts[1]).mint(accounts[1].address);
      await dc.connect(accounts[1]).approve(rs.address, 0);
      await dc.connect(accounts[1]).approve(rs.address, 2);
      await dc.connect(accounts[1]).approve(rs.address, 3);

      await rs.connect(accounts[0]).activateMint();

      // Account 1 Mints 3
      await rs.connect(accounts[1]).mint(3, [dc.address, dc.address, dc.address], [0, 2, 3], {
        from: accounts[1].address,
        value: parseUnits("0", "ether")
      });

      // Account 2 Mints 1 with not enough ether (free mints ran out)
      await dc.connect(accounts[2]).approve(rs.address, 1);
      await expect(
        rs.connect(accounts[2]).mint(1, [dc.address], [1], {
          from: accounts[2].address,
          value: parseUnits("0.028", "ether")
        })
      ).to.be.revertedWith(
        "VM Exception while processing transaction: reverted with reason string 'InsufficientFunds'"
      );

      let numMinted = await rs.numberMinted();
      expect(numMinted.toString()).to.equal("3");

      expect(await rs.ownerOf(0)).to.equal(accounts[1].address);
      expect(await rs.ownerOf(1)).to.equal(accounts[1].address);
      expect(await rs.ownerOf(2)).to.equal(accounts[1].address);
      expect(await rs.numGiftsLeft()).to.equal(3);

      await expectTokenOwnedToBe(rs, accounts[0].address, []);
      await expectTokenOwnedToBe(rs, accounts[1].address, [0, 1, 2]);
      await expectTokenOwnedToBe(rs, accounts[2].address, []);

      // Account 2 Mints 1 with enough ether
      await rs.connect(accounts[2]).mint(1, [dc.address], [1], {
        from: accounts[2].address,
        value: parseUnits("0.038", "ether")
      })

      numMinted = await rs.numberMinted();
      expect(numMinted.toString()).to.equal("4");

      expect(await rs.ownerOf(0)).to.equal(accounts[1].address);
      expect(await rs.ownerOf(1)).to.equal(accounts[1].address);
      expect(await rs.ownerOf(2)).to.equal(accounts[1].address);
      expect(await rs.ownerOf(3)).to.equal(accounts[2].address);
      expect(await rs.numGiftsLeft()).to.equal(4);

      await expectTokenOwnedToBe(rs, accounts[0].address, []);
      await expectTokenOwnedToBe(rs, accounts[1].address, [0, 1, 2]);
      await expectTokenOwnedToBe(rs, accounts[2].address, [3]);
    });

    it("should allow free minting for the whole txn", async () => {
      await dc.connect(accounts[1]).mint(accounts[1].address);
      await dc.connect(accounts[1]).approve(rs.address, 0);
      await dc.connect(accounts[1]).approve(rs.address, 2);

      await rs.connect(accounts[0]).activateMint();

      // Account 1 Mints 2 for free
      await rs.connect(accounts[1]).mint(2, [dc.address, dc.address], [0, 2], {
        from: accounts[1].address,
        value: parseUnits("0", "ether")
      });

      // Account 2 Mints 2 for free 
      await dc.connect(accounts[2]).mint(accounts[2].address);
      await dc.connect(accounts[2]).approve(rs.address, 1);
      await dc.connect(accounts[2]).approve(rs.address, 3);
      await  rs.connect(accounts[2]).mint(2, [dc.address, dc.address], [1, 3], {
          from: accounts[2].address,
          value: parseUnits("0", "ether")
        })

      let numMinted = await rs.numberMinted();
      expect(numMinted.toString()).to.equal("4");

      expect(await rs.ownerOf(0)).to.equal(accounts[1].address);
      expect(await rs.ownerOf(1)).to.equal(accounts[1].address);
      expect(await rs.ownerOf(2)).to.equal(accounts[2].address);
      expect(await rs.ownerOf(3)).to.equal(accounts[2].address);
      expect(await rs.numGiftsLeft()).to.equal(4);

      await expectTokenOwnedToBe(rs, accounts[0].address, []);
      await expectTokenOwnedToBe(rs, accounts[1].address, [0, 1]);
      await expectTokenOwnedToBe(rs, accounts[2].address, [2, 3]);

      // Account 2 Mints 1 more and tries to get it for free
      await dc.connect(accounts[2]).mint(accounts[2].address);
      await dc.connect(accounts[2]).approve(rs.address, 4);

      await expect(
        rs.connect(accounts[2]).mint(1, [dc.address], [4], {
          from: accounts[2].address,
          value: parseUnits("0", "ether")
        })
      ).to.be.revertedWith(
        "VM Exception while processing transaction: reverted with reason string 'InsufficientFunds'"
      );

      await expect(
        rs.connect(accounts[2]).mint(1, [dc.address], [4], {
          from: accounts[2].address,
          value: parseUnits("0.028", "ether")
        })
      ).to.be.revertedWith(
        "VM Exception while processing transaction: reverted with reason string 'InsufficientFunds'"
      );
    });
  });
});
