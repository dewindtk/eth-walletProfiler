# Kaikun26's walletProfiler:

This script was made for tax purposes. Input your wallet and a timeStamp (in Epoch) and you will see the entire inventory of your ETH wallet at that timeStamp. Enjoy :)

Please install these dependencies first:

```
npm, 
npm init
npm install node-fetch@2.6.6
npm install ethers
npm install mkdirp
````

Then fire up the script with 'node walletProfiler.js'

### In Short, 
Once you provide your info, a folder will be created in the same directory where all your past transactions will be stored. From there all transactions past the timestamp you have given will be cut, and the script will calculate your inventory based on all transactions that have been confirmed (including all Internal Txs and token transfers).

### TODO (Roadmap :P)
- UI
- Visualization of your inventory
- Iteration through timestamps with arrow keys
- ENS names
- Multiple wallets support
