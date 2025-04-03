require("@nomicfoundation/hardhat-toolbox");
require("@nomicfoundation/hardhat-ignition-ethers");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.28",
  networks: {
    tacTestnet: {
      url: "https://turin.rpc.tac.build",
      chainId: 2390,
      accounts: [""],

    },

  }
};
