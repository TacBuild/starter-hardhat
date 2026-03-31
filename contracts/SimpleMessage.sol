// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;


interface IMintableERC20 {
    function mint(address to, uint256 amount) external;
}

contract SimpleMessage {
    event MessageReceived(string message, address sender);

    // Store the last message received
    string public lastMessage;
    address public lastSender;
    address public mockToken;

    constructor(address _mockToken) {
        mockToken = _mockToken;
    }

    function setMessage(string memory _message) public returns (address, uint256) {
        lastMessage = _message;
        lastSender = msg.sender;
        emit MessageReceived(_message, msg.sender);

        // Mint 1 MTK to the sender (the Proxy)
        uint256 amountToMint = 1 ether;
        IMintableERC20(mockToken).mint(msg.sender, amountToMint);

        return (mockToken, amountToMint);
    }

    function getMessage() public view returns (string memory, address) {
        return (lastMessage, lastSender);
    }
}