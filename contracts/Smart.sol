// Importe le contrat du token ERC20 défini dans un fichier "token.sol"
import "./token.sol";

// Importe la bibliothèque SafeMath d'OpenZeppelin pour les opérations mathématiques sécurisées
import "@openzeppelin/contracts/utils/math/SafeMath.sol";

// Définition du contrat Smart
contract Smart {
    // Utilisation de SafeMath pour les calculs uint256 sécurisés
    using SafeMath for uint256;

    // Déclaration de variables publiques
    address payable public owner; // Adresse du propriétaire du contrat
    TokenERC20 public tokenContract; // Contrat du token ERC20 utilisé
    uint256 public tokenPrice; // Prix par token en wei
    uint256 public tokensSold; // Nombre total de tokens vendus

    mapping(address => uint256) public tokenBalance; // Mapping des soldes de tokens par adresse

    event Sell(address _buyer, uint256 _amount); // Événement déclenché lors d'un achat de tokens

    // Constructeur du contrat Smart, prend le contrat token ERC20 et le prix du token en paramètres
    constructor(TokenERC20 _tokenContract, uint256 _tokenPrice) {
        owner = payable(msg.sender); // Attribution de l'adresse du déploiement comme propriétaire
        tokenContract = _tokenContract; // Attribution du contrat ERC20
        tokenPrice = _tokenPrice; // Attribution du prix par token
    }

    // Fonction permettant d'acheter des tokens en échange d'Ether
    function buyTokens(uint256 _numberOfTokens) public payable {
        require(msg.value == _numberOfTokens.mul(tokenPrice), "Incorrect amount sent"); // Vérifie si le montant envoyé est correct

        uint256 availableTokens = tokenContract.balanceOf(address(this)); // Obtient le solde de tokens disponibles dans le contrat
        require(_numberOfTokens <= availableTokens, "Insufficient tokens available"); // Vérifie s'il y a suffisamment de tokens disponibles

        tokenBalance[msg.sender] = tokenBalance[msg.sender].add(_numberOfTokens); // Ajoute des tokens au solde de l'acheteur
        tokensSold = tokensSold.add(_numberOfTokens); // Met à jour le nombre total de tokens vendus

        emit Sell(msg.sender, _numberOfTokens); // Déclenche l'événement de vente de tokens
    }

    // Fonction permettant de clôturer la vente
    function endSale() public {
        require(msg.sender == owner, "You are not the owner"); // Vérifie si l'appelant est le propriétaire du contrat
        uint256 unsoldTokens = tokenContract.balanceOf(address(this)); // Obtient le nombre de tokens non vendus

        // Transfère les tokens non vendus au propriétaire du contrat
        if (unsoldTokens > 0) {
            tokenContract.transfer(owner, unsoldTokens);
        }

        owner.transfer(address(this).balance); // Transfère le solde Ether du contrat au propriétaire
    }
}
