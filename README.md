## TAC Starter Hardhat

A Hardhat starter template for building hybrid dApps on TAC with smart contracts that can receive messages from TON.

> This repository is part of the full starter application provided through the create-tac-app CLI tool.

### Features

- 📝 Solidity Contracts for TAC EVM Layer
- 🌉 TAC Proxy for receiving messages from TON
- 🔧 Hardhat Development Environment with full TAC support
- 🧪 Testing Framework for contract verification
- 🚀 Deployment Scripts for TAC testnet and mainnet

### Overview

This starter includes two main contracts:

- SimpleMessage: A basic contract that stores messages and emits events
- MessageProxy: A TAC proxy contract that receives cross-chain messages from TON and forwards them to SimpleMessage

### Prerequisites

Node.js 18.17.0 or higher
Knowledge of Solidity and EVM development
Some testnet TAC tokens for deployment (available from the TAC Testnet Faucet)

### Configuration

Before deploying, you need to configure your private key for TAC testnet. Create a .env file in the root directory:

```
PRIVATE_KEY=your_private_key_here
```

### Compilation & Testing

Test and compile the contracts:

```
npx hardhat test
npx hardhat compile
```



### Deployment

Deploy the contracts to TAC testnet:

```
npx hardhat run scripts/deploy.js --network tacTestnet
```

The deployment script will output the addresses of your deployed contracts. Save these for use in your frontend application.

### Understanding the Flow

- User sends a message from TON via the TAC SDK
- Message is routed through the TON Adapter to the TAC EVM Layer
- MessageProxy.processMessage() is called with the message data
- The proxy decodes the message and calls SimpleMessage.setMessage()
- The message is stored in the contract and an event is emitted

