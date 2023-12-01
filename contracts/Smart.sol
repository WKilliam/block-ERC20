// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./TokenERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Smart is Ownable {
    TokenERC20 public tokenContract;
    uint256 public tokenPrice;
    uint256 public tokensSold;

    mapping(address => uint256) public tokenBalance;

    event Sell(address _buyer, uint256 _amount);

    constructor(
        TokenERC20 _tokenContract,
        uint256 _tokenPrice
    )Ownable(msg.sender) {
        tokenContract = _tokenContract;
        tokenPrice = _tokenPrice;
    }

    function buyTokens(uint256 _numberOfTokens) external payable {
        require(msg.value == _numberOfTokens * tokenPrice, "Incorrect amount sent");

        uint256 availableTokens = tokenContract.balanceOf(address(this));
        require(_numberOfTokens <= availableTokens, "Insufficient tokens available");

        tokenBalance[msg.sender] += _numberOfTokens;
        tokensSold += _numberOfTokens;

        emit Sell(msg.sender, _numberOfTokens);
    }

    function endSale() external onlyOwner {
        uint256 unsoldTokens = tokenContract.balanceOf(address(this));

        if (unsoldTokens > 0) {
            tokenContract.transfer(owner(), unsoldTokens);
        }

        payable(owner()).transfer(address(this).balance);
    }
}
