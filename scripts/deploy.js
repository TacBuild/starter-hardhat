import 'dotenv/config';
import hre from "hardhat";

async function main() {
  console.log("Deploying contracts to", network.name);

  // 1. Deploy the SimpleMessage contract
  const SimpleMessage = await hre.ethers.getContractFactory("SimpleMessage");
  const simpleMessage = await SimpleMessage.deploy();
  await simpleMessage.waitForDeployment();
  const simpleMessageAddress = await simpleMessage.getAddress();
  console.log("SimpleMessage deployed to:", simpleMessageAddress);

  // 2. Get the CrossChainLayer address for the current network
  const crossChainLayerAddress = getCrossChainLayerAddress(hre.network.name);
  console.log("Using CrossChainLayer address:", crossChainLayerAddress);

  // 3. Deploy the MessageProxy contract
  const MessageProxy = await hre.ethers.getContractFactory("MessageProxy");
  const messageProxy = await MessageProxy.deploy(
    simpleMessageAddress,
    crossChainLayerAddress
  );
  await messageProxy.waitForDeployment();
  const messageProxyAddress = await messageProxy.getAddress();
  console.log("MessageProxy deployed to:", messageProxyAddress);

  console.log("Deployment complete!");
}

function getCrossChainLayerAddress(network) {
  const addresses = {
    // TAC testnet address
    tacTestnet: "0xAd2fBeB7CE5f6e4F9C21090C7e4018081f4b323d",
  };

  return addresses[network] || addresses.tacTestnet;
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });