const { expect } = require("chai");
const { parseUnits } = require("ethers").utils;

describe("SecretSanta - Registration", async function () {
  let rs = null;
  let ss = null;
  let owner = null;
  let accounts = null;

  beforeEach(async () => {
    const RagingSantas = await hre.ethers.getContractFactory("RagingSantas");
    accounts = await hre.ethers.getSigners();
    [owner] = accounts;
    const numSupply = 2;
    const numReserve = 0;
    rs = await RagingSantas.deploy(numSupply, numReserve);
  });

  it("should not allow minting if minting hasnt been activated", async () => {
    expect(await rs.mintActive()).to.equal(false);

    expect(rs.connect(accounts[1]).mint(1, [], [])).to.be.revertedWith(
      "Mint: Minting is not open yet!"
    );
  });

  it("should not allow minting if insufficient funds in ether", async () => {
    expect(await rs.mintActive()).to.equal(false);
    await rs.connect(accounts[0]).activateMint();
    expect(await rs.mintActive()).to.equal(true);

    // Just short of the 0.03 mint price
    await expect(
      rs.connect(accounts[1]).mint(1, [], [],{
        from: accounts[1].address,
        value: parseUnits(".0299", "ether")
      })
    ).to.be.revertedWith(
      "VM Exception while processing transaction: reverted with reason string 'Mint: Insufficient Funds For This Transaction'"
    );

    // Just short of 2 mints
    await expect(
      rs.connect(accounts[1]).mint(2, [], [],{
        from: accounts[1].address,
        value: parseUnits(".0599", "ether")
      })
    ).to.be.revertedWith(
      "VM Exception while processing transaction: reverted with reason string 'Mint: Insufficient Funds For This Transaction'"
    );

    const numMinted = await rs.numberMinted();
    expect(numMinted.toString()).to.equal("0");
  });

  it("should not allow minting if insufficient entry fee gift", async () => {
    await rs.connect(accounts[0]).activateMint();
    await expect(
      rs.connect(accounts[1]).mint(1, [], [], {
        from: accounts[1].address,
        value: parseUnits(".03", "ether")
      })
    ).to.be.revertedWith(
      "VM Exception while processing transaction: reverted with reason string 'Mint: Invalid gift parameters'"
    );
  });

  describe('assuming I have some nfts to gift', async () => {
    let dc;

    beforeEach(async () => {
      const DummyCollection = await hre.ethers.getContractFactory("DummyCollection");
      dc = await DummyCollection.deploy("Dummy", "DUM");
      await dc.connect(accounts[1]).mint(accounts[1].address)
      await dc.connect(accounts[2]).mint(accounts[2].address)
    });

    it("should not allow minting when gift parameters are invalid", async () => {
      // Verify account owns the first token of dummy collection
      expect(accounts[1].address).to.equal(await dc.ownerOf(0))

      // Approve RagingSanta for gifting this token (to happen in webUI)
      dc.connect(accounts[1]).approve(rs.address, 0);

      await rs.connect(accounts[0]).activateMint();

      await expect(
        rs.connect(accounts[1]).mint(1, [dc.address], [0, 1], {
          from: accounts[1].address,
          value: parseUnits(".03", "ether")
        })
      ).to.be.revertedWith(
        "VM Exception while processing transaction: reverted with reason string 'Mint: Invalid gift parameters'"
      )

      await expect(
        rs.connect(accounts[1]).mint(1, [dc.address, dc.address], [0], {
          from: accounts[1].address,
          value: parseUnits(".03", "ether")
        })
      ).to.be.revertedWith(
        "VM Exception while processing transaction: reverted with reason string 'Mint: Invalid gift parameters'"
      )
    });

    it("should allow minting multiple", async () => {
      await dc.connect(accounts[1]).mint(accounts[1].address)
      await dc.connect(accounts[1]).approve(rs.address, 0);
      await dc.connect(accounts[1]).approve(rs.address, 2);

      await rs.connect(accounts[0]).activateMint();
      await rs.connect(accounts[1]).mint(2, [dc.address, dc.address], [0, 2], {
        from: accounts[1].address,
        value: parseUnits(".06", "ether")
      })

      const numMinted = await rs.numberMinted();
      expect(numMinted.toString()).to.equal("2");

      expect(await rs.ownerOf(0)).to.equal(accounts[1].address);
      expect(await rs.ownerOf(1)).to.equal(accounts[1].address);
      expect(await rs.numGiftsLeft()).to.equal(2);
    });

    it("should allow minting if all conditions are met", async () => {
      // Verify account owns the first token of dummy collection
      expect(accounts[1].address).to.equal(await dc.ownerOf(0))
      expect(accounts[2].address).to.equal(await dc.ownerOf(1))

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
    });
  })

});
