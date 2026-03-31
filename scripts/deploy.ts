import { ethers, network } from 'hardhat';
import path from 'path';
import fs from 'fs';

async function main() {
    console.log(`Starting deployment on network: ${network.name}`);

    // Initialize deployer wallet
    const privateKey = process.env.PRIVATE_KEY;
    if (!privateKey) {
        throw new Error("Please set PRIVATE_KEY in .env file");
    }

    const deployer = new ethers.Wallet(privateKey, ethers.provider);
    console.log(`Deployer address: ${await deployer.getAddress()}`);

    const addressesFilePath = path.resolve(__dirname, '../addresses.json');

    // 1. Get CrossChainLayer address based on network
    let crossChainLayerAddress: string;
    if (network.name === "tacMainnet") {
        crossChainLayerAddress = "0x9fee01e948353E0897968A3ea955815aaA49f58d";
    } else if (network.name === "tacTestnet") {
        crossChainLayerAddress = "0x4f3b05a601B7103CF8Fc0aBB56d042e04f222ceE";
    } else {
        throw new Error(`Unsupported network: ${network.name}. Please use tacMainnet or tacTestnet.`);
    }

    console.log(`CrossChainLayer address: ${crossChainLayerAddress}`);

    // 2. Deploy MockToken
    console.log("Deploying MockToken...");
    const MockToken = await ethers.getContractFactory("MockToken", deployer);
    const mockToken = await MockToken.deploy();
    await mockToken.waitForDeployment();
    const mockTokenAddress = await mockToken.getAddress();
    console.log(`MockToken deployed at: ${mockTokenAddress}`);

    // 3. Deploy SimpleMessage
    console.log("Deploying SimpleMessage...");
    const SimpleMessage = await ethers.getContractFactory("SimpleMessage", deployer);
    const simpleMessage = await SimpleMessage.deploy(mockTokenAddress);
    await simpleMessage.waitForDeployment();
    const simpleMessageAddress = await simpleMessage.getAddress();
    console.log(`SimpleMessage deployed at: ${simpleMessageAddress}`);

    // 4. Deploy SimpleMessageProxy
    console.log("Deploying SimpleMessageProxy...");
    const SimpleMessageProxy = await ethers.getContractFactory("SimpleMessageProxy", deployer);
    const simpleMessageProxy = await SimpleMessageProxy.deploy(
        simpleMessageAddress,
        crossChainLayerAddress,
        mockTokenAddress
    );
    await simpleMessageProxy.waitForDeployment();
    const simpleMessageProxyAddress = await simpleMessageProxy.getAddress();
    console.log(`SimpleMessageProxy deployed at: ${simpleMessageProxyAddress}`);

    // 5. Transfer ownership of MockToken to SimpleMessage
    console.log("Transferring MockToken ownership to SimpleMessage...");
    const tx = await mockToken.transferOwnership(simpleMessageAddress);
    await tx.wait();
    console.log("Ownership transferred.");

    // 6. Save addresses (overwrite if present)
    const addresses = {
        mockToken: mockTokenAddress,
        simpleMessage: simpleMessageAddress,
        simpleMessageProxy: simpleMessageProxyAddress
    };

    fs.writeFileSync(addressesFilePath, JSON.stringify(addresses, null, 2));

    console.log("Deployment completed successfully!");
    console.log(`Addresses saved to: ${addressesFilePath}`);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
