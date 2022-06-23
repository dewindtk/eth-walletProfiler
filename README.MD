# Kaikun26's walletProfiler:

This script was made for tax purposes. Input your wallet and a timeStamp (in Epoch) and you will see the entire inventory of your ETH wallet at that timeStamp. Enjoy :)

Please install these dependencies first:

Download and install NodeJS from https://nodejs.org/en/download/

Clone this directory (Download and extract), navigate to this directory on your Command line and type:

```
npm init
npm install node-fetch@2.6.6
npm install ethers
npm install mkdirp
````

Then fire up the script with 'node walletProfiler.js'

### In Short, 
Once you provide your info, a folder will be created in the same directory where all your past transactions will be stored. From there all transactions past the timestamp you have given will be cut, and the script will calculate your inventory based on those that have been confirmed (including all Internal Txs and token transfers).

### TODO (Roadmap :P)
- UI
- Visualization of your inventory
- Iteration through timestamps with arrow keys
- ENS names
- Multiple wallets 

Pls send me feedbacks and requests on discord! :D

Caution: some contracts (such as the ETHERORCS NFT contract) may not Emit Token transfer events correctly. This means your inventory will not be updated correctly (As I am fetching your Txs from etherscan, which sometimes cannot be trusted). ETHERORCS is supported by this script, however if you get an error (or other errors in general) pls lmk and I will add support for those! Thx!
