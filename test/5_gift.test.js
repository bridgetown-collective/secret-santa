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

    expect(rs.connect(accounts[1]).mint(1)).to.be.revertedWith(
      "Mint: Minting is not open yet!"
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
        value: parseUnits(".0299", "ether")
      })
    ).to.be.revertedWith(
      "VM Exception while processing transaction: reverted with reason string 'Mint: Insufficient Funds For This Transaction'"
    );

    await expect(
      rs.connect(accounts[1]).mint(2, {
        from: accounts[1].address,
        value: parseUnits(".0599", "ether")
      })
    ).to.be.revertedWith(
      "VM Exception while processing transaction: reverted with reason string 'Mint: Insufficient Funds For This Transaction'"
    );

    const numMinted = await rs.numberMinted();
    expect(numMinted.toString()).to.equal("0");
  });

  it("should not allow minting if no gift supplied also", async () => {
    await rs.connect(accounts[0]).activateMint();
    await rs.connect(accounts[1]).mint(1, {
      from: accounts[1].address,
      value: parseUnits(".03", "ether")
    });

    const lol = await rs.numberMinted();
    expect(lol.toString()).to.equal("1");

    expect(await rs.ownerOf(0)).to.equal(accounts[1].address);
  });

  //  expect(await rs.ownerOf(0)).to.equal(accounts[1].address);
});
