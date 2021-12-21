const { expect } = require("chai");
const { parseUnits } = require("ethers").utils;
const { AddressZero } = require("ethers").constants;

describe("RagingSantas - Minting", async function () {
  let rs = null;
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

    await expect(rs.connect(accounts[1]).mint(1)).to.be.revertedWith(
      "VM Exception while processing transaction: reverted with reason string 'MintInactive'"
    );
  });

  it("should not allow minting if insufficient funds in ether", async () => {
    expect(await rs.mintActive()).to.equal(false);
    await rs.connect(accounts[0]).activateMint();
    expect(await rs.mintActive()).to.equal(true);

    // Just short of the 0.03 mint price
    await expect(
      rs.connect(accounts[1]).mint(1, {
        from: accounts[1].address,
        value: parseUnits(".0299", "ether"),
      })
    ).to.be.revertedWith(
      "VM Exception while processing transaction: reverted with reason string 'InsufficientFunds'"
    );

    // Just short of 1 mint
    await expect(
      rs.connect(accounts[1]).mint(1, {
        from: accounts[1].address,
        value: parseUnits(".0299", "ether"),
      })
    ).to.be.revertedWith(
      "VM Exception while processing transaction: reverted with reason string 'InsufficientFunds'"
    );

    const numMinted = await rs.numberMinted();
    expect(numMinted.toString()).to.equal("0");
  });

  it("should allow minting if all conditions are met", async () => {
    await rs.connect(accounts[0]).activateMint();

    await rs.connect(accounts[1]).mint(1, {
      from: accounts[1].address,
      value: parseUnits(".03", "ether"),
    });

    await rs.connect(accounts[2]).mint(1, {
      from: accounts[2].address,
      value: parseUnits(".03", "ether"),
    });

    expect(await rs.ownerOf(0)).to.equal(accounts[1].address);
    expect(await rs.ownerOf(1)).to.equal(accounts[2].address);
  });
});

describe("SecretSanta - FreeMinting", async function () {
  let rs = null;
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

  it("should allow minting for free", async () => {
    await rs.connect(accounts[0]).activateMint();
    await rs.connect(accounts[1]).mint(1, {
      from: accounts[1].address,
      value: parseUnits("0", "ether"),
    });
    await rs.connect(accounts[1]).mint(1, {
      from: accounts[1].address,
      value: parseUnits("0", "ether"),
    });

    const numMinted = await rs.numberMinted();
    expect(numMinted.toString()).to.equal("2");

    expect(await rs.ownerOf(0)).to.equal(accounts[1].address);
    expect(await rs.ownerOf(1)).to.equal(accounts[1].address);
  });

  it("should use regular mint price once num free gifts exhausted", async () => {
    await rs.connect(accounts[0]).activateMint();

    // Account 1 Mints 3
    await rs.connect(accounts[1]).mint(3, {
      from: accounts[1].address,
      value: parseUnits("0", "ether"),
    });
    expect((await rs.freeMintsLeft()).toString()).to.equal("0");

    // Account 2 Mints 1 with not enough ether (free mints ran out)
    await expect(
      rs.connect(accounts[2]).mint(1, {
        from: accounts[2].address,
        value: parseUnits("0.028", "ether"),
      })
    ).to.be.revertedWith(
      "VM Exception while processing transaction: reverted with reason string 'InsufficientFunds'"
    );

    let numMinted = await rs.numberMinted();
    expect(numMinted.toString()).to.equal("3");

    expect(await rs.ownerOf(0)).to.equal(accounts[1].address);
    expect(await rs.ownerOf(1)).to.equal(accounts[1].address);
    expect(await rs.ownerOf(2)).to.equal(accounts[1].address);

    // Account 2 Mints 1 with enough ether
    await rs.connect(accounts[2]).mint(1, {
      from: accounts[2].address,
      value: parseUnits("0.038", "ether"),
    });

    numMinted = await rs.numberMinted();
    expect(numMinted.toString()).to.equal("4");

    expect(await rs.ownerOf(0)).to.equal(accounts[1].address);
    expect(await rs.ownerOf(1)).to.equal(accounts[1].address);
    expect(await rs.ownerOf(2)).to.equal(accounts[1].address);
    expect(await rs.ownerOf(3)).to.equal(accounts[2].address);
  });

  it("should allow free minting for the whole txn", async () => {
    await rs.connect(accounts[0]).activateMint();

    // Account 1 Mints 2 for free
    await rs.connect(accounts[1]).mint(2, {
      from: accounts[1].address,
      value: parseUnits("0", "ether"),
    });

    // Account 2 Mints 2 for free
    await rs.connect(accounts[2]).mint(2, {
      from: accounts[2].address,
      value: parseUnits("0", "ether"),
    });

    let numMinted = await rs.numberMinted();
    expect(numMinted.toString()).to.equal("4");

    expect(await rs.ownerOf(0)).to.equal(accounts[1].address);
    expect(await rs.ownerOf(1)).to.equal(accounts[1].address);
    expect(await rs.ownerOf(2)).to.equal(accounts[2].address);
    expect(await rs.ownerOf(3)).to.equal(accounts[2].address);

    await expect(
      rs.connect(accounts[2]).mint(1, {
        from: accounts[2].address,
        value: parseUnits("0", "ether"),
      })
    ).to.be.revertedWith(
      "VM Exception while processing transaction: reverted with reason string 'InsufficientFunds'"
    );

    await expect(
      rs.connect(accounts[2]).mint(1, {
        from: accounts[2].address,
        value: parseUnits("0.028", "ether"),
      })
    ).to.be.revertedWith(
      "VM Exception while processing transaction: reverted with reason string 'InsufficientFunds'"
    );
  });
});
