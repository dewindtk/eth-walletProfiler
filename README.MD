# Kaikun26's walletProfiler:

This script was made for tax purposes. Input your wallet and a timeStamp (in Epoch) and you will see the entire inventory of your ETH wallet at that timeStamp. Enjoy :)

Please install these dependencies first:

Download and install NodeJS from https://nodejs.org/en/download/

Clone this directory (Download and extract), navigate to this directory on your Command line and type:

```
npm init (then press enter a bunch of times)
npm install
````

Then, You will need an ETH Mainnet API Key and an Etherscan API key which you can both get for free after creating an account on those platforms.
Please insert them into the ```.env.example``` file and rename this one to ```.env``` 

Finally, fire up the script with ```node walletProfiler.js```

### In Short, 
Once you provide your info, a folder will be created in the same directory where all your past transactions will be stored. From there all transactions past the timestamp you have given will be cut, and the script will calculate your inventory based on those that have been confirmed (including all Internal Txs and token transfers). This will create a txt file with your inventory:

- Your Ethereum balance,
- Your ERC20 Inventory (contract address: [TokenName, amount, Tokendecimal]) //Tokendecimal is used for calculations
- Your ERC721 Inventory (contract address: [CollectionName, ...TokenIDs])
- Your ERC1155 Inventory (contract adddress: [CollectionName, ...TokenIDs])

Please check the Example Output for reference :)


### TODO (Roadmap :P)
- UI (python?) (Actually no Python UI looks kinda shet)
- Visualization of your inventory
- Iteration through timestamps with arrow keys
- ENS names
- Multiple wallets at once

Pls send me feedbacks and requests on discord! :D

Caution: some contracts may not Emit Token transfer events correctly. This was the case for the EtherOrcs (both legacy and Genesis ) collections, which emitted tokenTransfer Events incorrectly which lead to incorrect representations on etherscan (Yup, learned here myself that etherscan cannot be fullly trusted). ETHERORCS is supported by this script, it goes through a manual inventory check on your recorded EtherOrcs balance. If you experience a similar situation (or other errors in general) pls lmk and I will add custom support for you! Thx!
