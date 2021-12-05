const { expect } = require("chai");
const { waffle } = require("hardhat");
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

  it("everyone claims on withdraw call", async () => {
    const rn = 17261481202;
    await rs.connect(owner).activateClaim(rn);

    const provider = waffle.provider;
    let balance0ETH = (await provider.getBalance(rs.address)).toString();
    expect(balance0ETH).to.equal('570000000000000000')

    const grumpyAddress = '0x2DFfA4DFF855A866974502D52DCc82943F63F225';
    await rs.connect(accounts[0]).withdraw();

    balance0ETH = (await provider.getBalance(rs.address)).toString();
    expect(balance0ETH).to.equal('427500000000000000')

    balance0ETH = (await provider.getBalance(grumpyAddress)).toString();
    expect(balance0ETH).to.equal('142500000000000000')
  });
});