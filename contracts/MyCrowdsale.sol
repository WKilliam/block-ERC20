// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "hardhat/console.sol";

contract MyCrowdsale is Ownable {
    using SafeMath for uint256;

    IERC20 public token;
    uint256 public rate; // Number of tokens per ETH
    uint256 public minPurchase; // Minimum ETH amount for purchase
    uint256 public maxPurchase; // Maximum ETH amount for purchase
    uint256 public hardCap; // Total ETH limit to be collected
    uint256 public startTime;
    uint256 public endTime;
    uint256 public tokenSold;
    bool public isFinalized = false;

    event TokensPurchased(address indexed buyer, uint256 amount, uint256 value);
    event Finalized();

    modifier onlyWhileOpen() {
        require(block.timestamp >= startTime && block.timestamp <= endTime, "La levee de fonds n'est pas ouverte.");
        _;
    }

    modifier onlyNotFinalized() {
        require(!isFinalized, "La levee de fonds est finalisee.");
        _;
    }

    constructor(
        IERC20 _token,
        uint256 _rate,
        uint256 _minPurchase,
        uint256 _maxPurchase,
        uint256 _hardCap,
        uint256 _startTime,
        uint256 _endTime
    ) {
        //require(_startTime >= block.timestamp, "Le temps de debut est dans le passe.");
        require(_endTime > _startTime, "Le temps de fin doit etre apres le temps de debut.");
        require(_rate > 0, "Le taux doit etre superieur a zero.");
        require(_minPurchase > 0, "L'achat minimum doit etre superieur a zero.");
        require(_maxPurchase > _minPurchase, "L'achat maximum doit etre superieur a l'achat minimum.");
        require(_hardCap > 0, "Le hard cap doit etre superieur a zero.");

        tokenSold=0;
        token = _token;
        rate = _rate;
        minPurchase = _minPurchase;
        maxPurchase = _maxPurchase;
        hardCap = _hardCap;
        startTime = _startTime;
        endTime = _endTime;
    }

    receive() external payable {
        buyTokens(msg.sender);
    }

    function buyTokens(address beneficiary) public payable onlyWhileOpen onlyNotFinalized {
        require(beneficiary != address(0), "Adresse invalide.");
        require(msg.value >= minPurchase && msg.value <= maxPurchase, "Montant d'achat invalide.");

        uint256 weiAmount = msg.value;
        uint256 tokens = weiAmount.mul(rate);

        // Check if the purchase exceeds the hard cap
        console.log(hardCap);
        require(tokenSold.add(tokens) <= hardCap, "L'achat depasse le hard cap.");

        // Transfer tokens to the beneficiary
        token.transfer(beneficiary, tokens);

        tokenSold += tokens;
        
        // Emit the purchase event
        emit TokensPurchased(beneficiary, tokens, weiAmount);
    }

    function finalize() external onlyOwner {
        require(!isFinalized, "La levee de fonds est deja finalisee.");

        // Transfer collected ETH to the owner
        payable(owner()).transfer(address(this).balance);

        // Allow the owner to retrieve unsold tokens
        uint256 unsoldTokens = token.balanceOf(address(this));
        if (unsoldTokens > 0) {
            token.transfer(owner(), unsoldTokens);
        }

        // Mark the crowdsale as finalized
        isFinalized = true;

        // Emit the finalization event
        emit Finalized();
    }

    //function tokensSold() public view returns (uint256) {
    //    return token.totalSupply();
    //}
}
