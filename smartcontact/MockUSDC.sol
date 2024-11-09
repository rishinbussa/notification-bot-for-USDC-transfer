// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract MockUSDC is ERC20 {
    constructor(uint256 initialSupply) ERC20("Mock USD Coin", "USDC") {
        _mint(msg.sender, initialSupply * (10 ** uint256(decimals())));
    }
}