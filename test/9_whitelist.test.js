const { expect } = require("chai");
const { parseUnits } = require("ethers").utils;
const { AddressZero } = require("ethers").constants;

async function expectTokenOwnedToBe(rs, address, expectedArr) {
  for (let i = 0; i < expectedArr.length; i++) {
    let ownerAdd = await rs.ownerOf(expectedArr[i]);
    expect(ownerAdd).to.equal(address);
  }
}

describe("SecretSanta - FreeMinting", async function () {
  let rs = null;
  let ss = null;
  let owner = null;
  let accounts = null;
  let dc;

  beforeEach(async () => {
    const RagingSantas = await hre.ethers.getContractFactory("RagingSantas");
    accounts = await hre.ethers.getSigners();
    [owner] = accounts;
    const numSupply = 5;
    const numFreeMints = 1;
    rs = await RagingSantas.deploy(numSupply, numFreeMints);

    const DummyCollection = await hre.ethers.getContractFactory(
      "DummyCollection"
    );
    dc = await DummyCollection.deploy("Dummy", "DUM");
    await dc.connect(accounts[1]).mint(accounts[1].address);
    await dc.connect(accounts[2]).mint(accounts[2].address);
    await dc.connect(accounts[3]).mint(accounts[3].address);
  });

  it("should not let you whitelist an address if youre not owner", async () => {
    await expect(
      rs.connect(accounts[1]).addWhitelist([accounts[1].address])
    ).to.be.revertedWith("Ownable: caller is not the owner");
  });

  it("should let you whitelist an address(s) if you're the owner", async () => {
    await rs.connect(accounts[0]).addWhitelist([accounts[1].address]);
    await rs
      .connect(accounts[0])
      .addWhitelist([accounts[2].address, accounts[3].address]);
  });

  it("should give free mint if you're on whitelist", async () => {
    await dc.connect(accounts[1]).approve(rs.address, 0);
    await dc.connect(accounts[2]).approve(rs.address, 1);
    await dc.connect(accounts[3]).approve(rs.address, 2);

    await rs.connect(accounts[0]).addWhitelist([accounts[1].address]);
    await rs.connect(accounts[0]).activateMint();

    // Account 1 Mints 1 (whitelist)
    await rs.connect(accounts[1]).mint(dc.address, 0, {
      from: accounts[1].address,
      value: parseUnits("0", "ether"),
    });

    let numMinted = await rs.numberMinted();
    expect(numMinted.toString()).to.equal("1");

    expect(await rs.ownerOf(0)).to.equal(accounts[1].address);
    expect(await rs.numGiftsLeft()).to.equal(1);
    expect(await rs.freeMintsLeft()).to.equal(1);

    await expectTokenOwnedToBe(rs, accounts[0].address, []);
    await expectTokenOwnedToBe(rs, accounts[1].address, [0]);

    // Account 2 Mints 1 (free mint)
    await rs.connect(accounts[2]).mint(dc.address, 1, {
      from: accounts[2].address,
      value: parseUnits("0", "ether"),
    });

    numMinted = await rs.numberMinted();
    expect(numMinted.toString()).to.equal("2");

    expect(await rs.ownerOf(1)).to.equal(accounts[2].address);
    expect(await rs.numGiftsLeft()).to.equal(2);
    expect(await rs.freeMintsLeft()).to.equal(0);

    await expectTokenOwnedToBe(rs, accounts[2].address, [1]);

    // Account 3 Mints 1 (free mint fails)
    await expect(
      rs.connect(accounts[3]).mint(dc.address, 2, {
        from: accounts[3].address,
        value: parseUnits("0", "ether"),
      })
    ).to.be.revertedWith(
      "VM Exception while processing transaction: reverted with reason string 'InsufficientFunds'"
    );

    numMinted = await rs.numberMinted();
    expect(numMinted.toString()).to.equal("2");
    expect(await rs.numGiftsLeft()).to.equal(2);
    expect(await rs.freeMintsLeft()).to.equal(0);
    await expectTokenOwnedToBe(rs, accounts[3].address, []);

    await rs.connect(accounts[0]).addWhitelist([accounts[3].address]);

    await rs.connect(accounts[3]).mint(dc.address, 2, {
      from: accounts[3].address,
      value: parseUnits("0", "ether"),
    });

    numMinted = await rs.numberMinted();
    expect(numMinted.toString()).to.equal("3");
    expect(await rs.numGiftsLeft()).to.equal(3);
    expect(await rs.freeMintsLeft()).to.equal(0);
    await expectTokenOwnedToBe(rs, accounts[3].address, [2]);
  });

  it("should give free mint only once to those whitelisted", async () => {
    await dc.connect(accounts[1]).approve(rs.address, 0);
    await dc.connect(accounts[2]).approve(rs.address, 1);
    await dc.connect(accounts[3]).approve(rs.address, 2);

    await rs.connect(accounts[0]).addWhitelist([accounts[1].address]);
    await rs.connect(accounts[0]).activateMint();

    // Account 1 Mints 1 (whitelist)
    expect(await rs.whitelist(accounts[1].address)).to.equal(true);
    await rs.connect(accounts[1]).mint(dc.address, 0, {
      from: accounts[1].address,
      value: parseUnits("0", "ether"),
    });

    let numMinted = await rs.numberMinted();
    expect(numMinted.toString()).to.equal("1");

    expect(await rs.ownerOf(0)).to.equal(accounts[1].address);
    expect(await rs.numGiftsLeft()).to.equal(1);
    expect(await rs.freeMintsLeft()).to.equal(1);

    await expectTokenOwnedToBe(rs, accounts[0].address, []);
    await expectTokenOwnedToBe(rs, accounts[1].address, [0]);
    expect(await rs.whitelist(accounts[0].address)).to.equal(false);

    // Account 2 Mints 1 (free mint)
    await rs.connect(accounts[2]).mint(dc.address, 1, {
      from: accounts[2].address,
      value: parseUnits("0", "ether"),
    });

    numMinted = await rs.numberMinted();
    expect(numMinted.toString()).to.equal("2");

    expect(await rs.ownerOf(1)).to.equal(accounts[2].address);
    expect(await rs.numGiftsLeft()).to.equal(2);
    expect(await rs.freeMintsLeft()).to.equal(0);

    await expectTokenOwnedToBe(rs, accounts[2].address, [1]);

    // Account 1 Mints 1 (whitelist)
    await expect(
      rs.connect(accounts[1]).mint(dc.address, 0, {
        from: accounts[1].address,
        value: parseUnits("0", "ether"),
      })
    ).to.be.revertedWith(
      "VM Exception while processing transaction: reverted with reason string 'InsufficientFunds'"
    );

    numMinted = await rs.numberMinted();
    expect(numMinted.toString()).to.equal("2");
    expect(await rs.numGiftsLeft()).to.equal(2);
    expect(await rs.freeMintsLeft()).to.equal(0);
    expect(await rs.whitelist(accounts[1].address)).to.equal(false);
    await expectTokenOwnedToBe(rs, accounts[1].address, [0]);
  });
});
