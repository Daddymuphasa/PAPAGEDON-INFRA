const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying PapagedonNFT with account:", deployer.address);

  const PapagedonNFT = await hre.ethers.getContractFactory("PapagedonNFT");
  const nft = await PapagedonNFT.deploy(deployer.address);

  await nft.waitForDeployment();

  console.log("PapagedonNFT deployed to:", await nft.getAddress());
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
