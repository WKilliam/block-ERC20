# Token publiés et déployés: 
https://mumbai.polygonscan.com/address/0x908C79d78544ffF5ba4AD828A5E518030b006141#code

# Tester les tokens :
```shell
npx hardhat test
```

# Déployer les tokens :
```shell
npx hardhat run scripts/deploy.js --network mumbai
```

# Addresses :
MyToken address : 0x57EBA3AFbfCFE7877F7057158855B30BDC3cc8E9

MyCrowdsale address : 0x37234e8f29A509c9EaB8Db305CB8778D8274610e

# Vérifier le code source :
```shell
npx hardhat verify --network mumbai 0x57EBA3AFbfCFE7877F7057158855B30BDC3cc8E9
npx hardhat verify --network mumbai 0x37234e8f29A509c9EaB8Db305CB8778D8274610e "0x57EBA3AFbfCFE7877F7057158855B30BDC3cc8E9" 100 1 10 100 1638326400 1638412800
```
