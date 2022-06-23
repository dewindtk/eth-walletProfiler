const utils = require("./subScripts/utils.js")
const fs = require("fs")
const readline = require("readline");
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

var wallets = {}
var addy = ""
var wname = ""
var stamp = ""
var ETHInv = 0
var ERC20Inv = {}
var ERC721Inv = {}
var ERC1155Inv = {}

const question1 = () => {
    return new Promise((resolve, reject) => {
        rl.question("Please input the Wallet to be analysed: ", function (answer) {
            addy = answer.toLowerCase()
            resolve()
        });
    })
}

const question2 = () => {
    return new Promise((resolve, reject) => {
        rl.question("Please name the Wallet you have just entered: ", function (answer) {
            wname = answer
            resolve()
        });
    })
}

const question3 = () => {
    return new Promise((resolve, reject) => {
        rl.question("Please input the Timestamp you would like to see your Wallet at (in Epoch): ", function (answer) {
            stamp = answer
            resolve()
        });
    })
}


async function main(){
    await question1()
    await question2()
    await question3()
    rl.close()

    wallets[addy] = [wname, stamp]
    console.log(addy, wname, stamp)

    console.log("Saving wallet data in wallets.json: ", wallets)
    await fs.promises.writeFile("./wallets.json", JSON.stringify(wallets), (err) => {
        if (err) {
            throw err;
        }
    return 0
    });

    fs.mkdirSync((`./WALLET_${wname}`))

    const fetchTxs = require("./subScripts/fetschTxs.js")
    await fetchTxs.main()
    console.log("fetchTxs done")
    const prepareJsonArray = require("./subScripts/prepareJsonArray.js")
    await prepareJsonArray.main()
    console.log("prepareJsonArray done")
    const processTxs = require("./subScripts/processTxs")
    console.log("processing Txs...")
    processTxs.main(ETHInv)
}

console.log("testing script...")
main()
