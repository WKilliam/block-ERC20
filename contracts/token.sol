// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

// Importation de la bibliothèque OpenZeppelin ERC20
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

// Déclaration du contrat TokenERC20 qui hérite de ERC20
contract TokenERC20 is ERC20 {
    // Déclaration d'une variable publique pour stocker l'adresse de l'administrateur
    address public admin;

    // Constructeur du contrat prenant le nom et le symbole du token en paramètres
    constructor(string memory name, string memory symbol) ERC20(name, symbol) {
        // Attribution de l'adresse du déploiement comme administrateur du contrat
        admin = msg.sender;

        // Création de 1,000,000 tokens lors du déploiement, attribués à l'administrateur
        _mint(msg.sender, 1000000 * 10 ** uint(decimals()));
    }
}
