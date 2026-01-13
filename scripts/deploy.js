import hre from "hardhat";

async function main() {
  const InfinityToken = await ethers.getContractFactory("InfinityToken");
  const token = await InfinityToken.deploy();

  await token.waitForDeployment();

  console.log("InfinityToken deployed to:", await token.getAddress());
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
