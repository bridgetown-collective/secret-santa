const { expect } = require("chai");
const { parseUnits } = require("ethers").utils;

describe("SecretSanta - FreeMinting", async function () {
  let rs = null;
  let accounts = null;

  beforeEach(async () => {
    const RagingSantas = await hre.ethers.getContractFactory("RagingSantas");
    accounts = await hre.ethers.getSigners();
    [owner] = accounts;
    const numSupply = 5;
    const numFreeMints = 1;
    rs = await RagingSantas.deploy(numSupply, numFreeMints);
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
    await rs.connect(accounts[0]).addWhitelist([accounts[1].address]);
    await rs.connect(accounts[0]).activateMint();

    // Account 1 Mints 1 (whitelist)
    await rs.connect(accounts[1]).mint(1, {
      from: accounts[1].address,
      value: parseUnits("0", "ether"),
    });

    let numMinted = await rs.numberMinted();
    expect(numMinted.toString()).to.equal("1");

    expect(await rs.ownerOf(0)).to.equal(accounts[1].address);
    expect(await rs.freeMintsLeft()).to.equal(1);

    // Account 2 Mints 1 (free mint)
    await rs.connect(accounts[2]).mint(1, {
      from: accounts[2].address,
      value: parseUnits("0", "ether"),
    });

    numMinted = await rs.numberMinted();
    expect(numMinted.toString()).to.equal("2");

    expect(await rs.ownerOf(1)).to.equal(accounts[2].address);
    expect(await rs.freeMintsLeft()).to.equal(0);

    // Account 3 Mints 1 (free mint fails)
    await expect(
      rs.connect(accounts[3]).mint(1, {
        from: accounts[3].address,
        value: parseUnits("0", "ether"),
      })
    ).to.be.revertedWith(
      "VM Exception while processing transaction: reverted with reason string 'InsufficientFunds'"
    );

    numMinted = await rs.numberMinted();
    expect(numMinted.toString()).to.equal("2");
    expect(await rs.freeMintsLeft()).to.equal(0);

    await rs.connect(accounts[0]).addWhitelist([accounts[3].address]);

    await rs.connect(accounts[3]).mint(1, {
      from: accounts[3].address,
      value: parseUnits("0", "ether"),
    });

    numMinted = await rs.numberMinted();
    expect(numMinted.toString()).to.equal("3");
    expect(await rs.freeMintsLeft()).to.equal(0);
  });

  it("should give free mint only once to those whitelisted", async () => {
    await rs.connect(accounts[0]).addWhitelist([accounts[1].address]);
    await rs.connect(accounts[0]).activateMint();

    // Account 1 Mints 1 (whitelist)
    expect(await rs.whitelist(accounts[1].address)).to.equal(true);
    await rs.connect(accounts[1]).mint(1, {
      from: accounts[1].address,
      value: parseUnits("0", "ether"),
    });

    let numMinted = await rs.numberMinted();
    expect(numMinted.toString()).to.equal("1");

    expect(await rs.ownerOf(0)).to.equal(accounts[1].address);
    expect(await rs.freeMintsLeft()).to.equal(1);

    expect(await rs.whitelist(accounts[0].address)).to.equal(false);

    // Account 2 Mints 1 (free mint)
    await rs.connect(accounts[2]).mint(1, {
      from: accounts[2].address,
      value: parseUnits("0", "ether"),
    });

    numMinted = await rs.numberMinted();
    expect(numMinted.toString()).to.equal("2");

    expect(await rs.ownerOf(1)).to.equal(accounts[2].address);
    expect(await rs.freeMintsLeft()).to.equal(0);

    // Account 1 Mints 1 (whitelist)
    await expect(
      rs.connect(accounts[1]).mint(1, {
        from: accounts[1].address,
        value: parseUnits("0", "ether"),
      })
    ).to.be.revertedWith(
      "VM Exception while processing transaction: reverted with reason string 'InsufficientFunds'"
    );

    numMinted = await rs.numberMinted();
    expect(numMinted.toString()).to.equal("2");
    expect(await rs.freeMintsLeft()).to.equal(0);
    expect(await rs.whitelist(accounts[1].address)).to.equal(false);
  });
});
