// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract MockUSDC is ERC20 {
    constructor() ERC20("Mock USDC", "mUSDC") {
        _mint(msg.sender, 100000 * 10 ** 6); // Mint some initial supply for testing
       
    }


    function decimals() public pure override returns (uint8) {
        return 6;
    }


     // Public burn function that allows anyone to burn their tokens
    function burn(uint256 amount) external {
        _burn(msg.sender, amount);
    }

    // Public mint function that allows anyone to mint tokens
    function mint(uint256 amount) external {
        _mint(msg.sender, amount);
    }
    
}
