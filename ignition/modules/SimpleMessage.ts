// This setup uses Hardhat Ignition to manage smart contract deployments.
// Learn more about it at https://hardhat.org/ignition

import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const MessageSystemModule = buildModule("MessageSystemModule", (m) => {
  // 1. Deploy MockToken first
  const mockToken = m.contract("MockToken");

  // 2. Deploy SimpleMessage contract with MockToken address
  const simpleMessage = m.contract("SimpleMessage", [mockToken]);

  // 3. Get CrossChainLayer address based on network
  const crossChainLayerAddress = m.getParameter(
      "crossChainLayerAddress",
      getCrossChainLayerAddress()
  );

  // 4. Deploy MessageProxy contract with SimpleMessage, CrossChainLayer and MockToken addresses
  const messageProxy = m.contract("SimpleMessageProxy", [
    simpleMessage,
    crossChainLayerAddress,
    mockToken,
  ]);

  // 5. Transfer ownership of MockToken to SimpleMessage so it can mint tokens
  m.call(mockToken, "transferOwnership", [simpleMessage]);

  return {
    mockToken,
    simpleMessage,
    messageProxy,
  };
});

function getCrossChainLayerAddress(networkName?: string): string {
  if (networkName === "tacMainnet") {
    return "0x9fee01e948353E0897968A3ea955815aaA49f58d";
  }
  // Default to TAC testnet CrossChainLayer address
  return "0x4f3b05a601B7103CF8Fc0aBB56d042e04f222ceE";
}

export default MessageSystemModule;
