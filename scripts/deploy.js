async function main() {
  const RagingSanta = await hre.ethers.getContractFactory("RagingSantas");
  const ragingSanta = await RagingSanta.deploy();

  await ragingSanta.deployed();

  console.log("RagingSanta deployed to:", ragingSanta.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
