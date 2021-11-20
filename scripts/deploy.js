async function main() {
  const SecretSanta = await hre.ethers.getContractFactory("SecretSanta");
  const secretSanta = await SecretSanta.deploy();

  await secretSanta.deployed();

  console.log("SecretSanta deployed to:", secretSanta.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
