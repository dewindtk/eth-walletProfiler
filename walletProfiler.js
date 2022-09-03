const readline = require("readline");
const utils = require("./subScripts/utils.js")
const args = require('args-parser')(process.argv)
const fs = require("fs")
var wallets = {}
var addy = ""
var wname = ""
var stamp = ""

const rl = readline.createInterface({input: process.stdin,output: process.stdout,});

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

    if (Object.keys(args).length == 3)
    {
        addy = args.addy.toLowerCase()
        wname = args.wname
        stamp = args.stamp
    }
    else
    {
        await question1()
        await question2()
        await question3()
        rl.close()
    }


    wallets[addy] = [wname, stamp]

    console.log("Saving wallet data in wallets.json: ", wallets)
    await fs.promises.writeFile("./wallets.json", JSON.stringify(wallets), (err) => {
        if (err) {
            throw err;
        }
    return 0
    });

    fs.mkdirSync((`./WALLET_${wname}`))

    const fetchTxs = require("./subScripts/fetschTxs.js")
    console.log("Fetching all Txs related to this wallet, a moment of patience please...")
    await fetchTxs.main()
    console.log("----FetchTxs DONE")

    const prepareJsonArray = require("./subScripts/prepareJsonArray.js")
    console.log("Parsing Txs...")
    await prepareJsonArray.main()
    console.log("----PrepareJsonArrays DONE")

    const processTxs = require("./subScripts/processTxs")
    console.log("processing Txs...")
    processTxs.main()
    
}

console.log("Running Scripts...")
main()
