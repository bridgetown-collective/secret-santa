const { expect } = require("chai");
const { waffle } = require("hardhat");
const { parseUnits } = require("ethers").utils;

describe("SecretSanta - Withdraw", async function () {
  let rs = null;
  let owner = null;
  let accounts = null;

  beforeEach(async () => {
    const RagingSantas = await hre.ethers.getContractFactory("RagingSantas");
    accounts = await hre.ethers.getSigners();
    [owner] = accounts;

    const numSupply = accounts.length;
    const freeMints = 0;
    rs = await RagingSantas.deploy(numSupply, freeMints);
    rs.connect(owner).setProvHashMint("abcdef");

    await rs.connect(owner).activateMint();

    const quantity = accounts.length - 1;
    await rs.connect(accounts[1]).mint(quantity, {
      from: accounts[1].address,
      value: parseUnits((quantity * 0.03).toString(), "ether"),
    });
  });

  it("withdraws all", async () => {
    const provider = waffle.provider;
    let balance0ETH = (await provider.getBalance(rs.address)).toString();
    expect(balance0ETH).to.equal("570000000000000000");

    balance0ETH = (await provider.getBalance(accounts[0].address)).toString();
    expect(balance0ETH).to.equal("9999966416911884108440");

    await rs.connect(accounts[0]).withdraw();

    balance0ETH = (await provider.getBalance(accounts[0].address)).toString();
    expect(balance0ETH).to.equal("10000536385579946658326");
  });
});
