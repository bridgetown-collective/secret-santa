const { expect } = require("chai");
const { parseUnits, getAddress } = require("ethers").utils;
const { AddressZero } = require("ethers").constants;

describe("gas test", async function () {
  let owner = null;
  let accounts = null;
  let rs = null;
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
    await dc.connect(accounts[3]).mint(accounts[3].address);

    // Approve RagingSanta for gifting this token (to happen in webUI)
    dc.connect(accounts[1]).approve(rs.address, 0);
    dc.connect(accounts[2]).approve(rs.address, 1);
    dc.connect(accounts[3]).approve(rs.address, 2);

    await rs.connect(owner).activateMint();
    await rs.connect(accounts[1]).mint(dc.address, 0, {
      from: accounts[1].address,
      value: parseUnits(".03", "ether"),
    });
    await rs.connect(accounts[2]).mint(dc.address, 1, {
      from: accounts[2].address,
      value: parseUnits(".03", "ether"),
    });
    await rs.connect(accounts[3]).mint(dc.address, 2, {
      from: accounts[3].address,
      value: parseUnits(".03", "ether"),
    });
    console.log("accounts[1]", accounts[1].address, "gifted dc:0");
    console.log("accounts[2]", accounts[2].address, "gifted dc:1");
    console.log("accounts[3]", accounts[3].address, "gifted dc:2");
  });

  it("gas test", async () => {
    var methodSignature = web3.eth.abi.encodeFunctionSignature(
      "activateClaim(uint256)"
    );
    var encodedParameter = web3.eth.abi.encodeParameter("uint256", "1234");

    var data =
      methodSignature + //method signature
      encodedParameter.substring(2); //hex of input string without '0x' prefix

    let gas = await web3.eth.estimateGas({
      from: owner.address,
      to: rs.address,
      data: data,
      value: 0,
      function(estimatedGas, err) {
        console.log("estimatedGas: " + estimatedGas);
         web3.toWei(1, "ether")
        console.log("Err:" + err);
      }
    });
    console.log("Gas: " + gas);
  });
});
