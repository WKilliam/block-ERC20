// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./token.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";

contract Smart {
    using SafeMath for uint256;
    
    address payable public owner;
    TokenERC20 public tokenContract;
    uint256 public tokenPrice;
    uint256 public tokensSold;

    mapping(address => uint256) public tokenBalance;

    event Sell(address _buyer, uint256 _amount);

    constructor(TokenERC20 _tokenContract, uint256 _tokenPrice) {
        owner = payable(msg.sender);
        tokenContract = _tokenContract;
        tokenPrice = _tokenPrice;
    }

    function buyTokens(uint256 _numberOfTokens) public payable {
        require(msg.value == _numberOfTokens.mul(tokenPrice), "Incorrect amount sent");

        uint256 availableTokens = tokenContract.balanceOf(address(this));
        require(_numberOfTokens <= availableTokens, "Insufficient tokens available");

        tokenBalance[msg.sender] = tokenBalance[msg.sender].add(_numberOfTokens);
        tokensSold = tokensSold.add(_numberOfTokens);

        emit Sell(msg.sender, _numberOfTokens);
    }

    function endSale() public {
        require(msg.sender == owner, "You are not the owner");
        uint256 unsoldTokens = tokenContract.balanceOf(address(this));
        if (unsoldTokens > 0) {
            tokenContract.transfer(owner, unsoldTokens);
        }
        owner.transfer(address(this).balance);
    }
}
