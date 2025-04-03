// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

import { TacProxyV1 } from "tac-l2-ccl/contracts/proxies/TacProxyV1.sol";
import { TokenAmount, OutMessageV1, TacHeaderV1 } from "tac-l2-ccl/contracts/L2/Structs.sol";
import "./SimpleMessage.sol";

contract MessageProxy is TacProxyV1 {
    SimpleMessage public messageContract;
    
    // Store the parameters sent from TON
    struct MessageParams {
        string message;
    }
    
    event MessageProcessed(string message, address sender);
    
    constructor(address _messageContract, address _crossChainLayer) 
        TacProxyV1(_crossChainLayer) 
    {
        messageContract = SimpleMessage(_messageContract);
    }
    
    // This function will be called from the TON side
    function processMessage(bytes calldata tacHeader, bytes calldata arguments) 
        external 
        _onlyCrossChainLayer 
    {
        // 1. Decode the TAC header
        _decodeTacHeader(tacHeader);
        
        // 2. Decode the message parameters
        MessageParams memory params = abi.decode(arguments, (MessageParams));
        
        // 3. Call the message contract to store the message
        messageContract.setMessage(params.message);
        
        // 4. Emit an event for tracking
        emit MessageProcessed(params.message, msg.sender);
        
        // 5. Optional: Send a response back to TON if needed
        // For this simple example, we're not sending anything back
    }
}