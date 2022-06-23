wallets = require('../wallets.json')
mainScript = require("../walletProfiler")
//Only supports one wallet for now
wallet = Object.keys(wallets)[0]
wname = wallets[wallet][0]
timeStamp = wallets[wallet][1]

const utils = require('./utils.js');
const fetch = require('node-fetch');
// const Web3 = require('web3');
const ethers = require('ethers');
const userTxs = require(`../WALLET_${wname}/${wname}_MERGEDTxs_${timeStamp}.json`)
// var web3 = new Web3(Web3.givenProvider || 'https://eth-mainnet.alchemyapi.io/v2/JNemY7zxf_s_VMtUSeb74DsUYIyuzedA');


ETHInv = 0
ERC20Inv = {}
ERC721Inv = {}
ERC1155Inv = {}


// For normal IMPORTANT: only +- value and not the tokens minted/transfered, those will be in ERC20/721
function processNormal(tx)
{
    if (tx.to.toLowerCase() === wallet)
    {
        if (tx.isError === "0")
        {
            ETHInv += parseFloat(ethers.utils.formatEther(tx.value))
        }
        
    }
    if (tx.from.toLowerCase() === wallet)
    {
        //Tx Gas Cost
        txCost = ethers.utils.formatEther(ethers.BigNumber.from(tx.gasUsed).mul(ethers.BigNumber.from(tx.gasPrice)))
        ETHInv -= txCost
        //Tx Value Cost
        if (tx.isError === "0")
        {
            txValue = parseFloat(ethers.utils.formatEther(tx.value))
            ETHInv -= txValue
        }
    }
}

// TODO staking rewards (income and stuff)
// TODO if transfer in and out in the same tx, ordering might conflict with process --> hold processing and retry after next?

function processInternal(tx)
{
    if (tx.to.toLowerCase() === wallet && tx.isError === "0")
    {
        ETHInv += parseFloat(ethers.utils.formatEther(tx.value))
    }
}

function processERC20(tx)
{
    // Amount is not milimetergenau. Change to BigNumber for genau genauness af
    thisToken = {
        contractAddress: tx.contractAddress,
        tokenName: tx.tokenName,
        tokenSymbol: tx.tokenSymbol,
        amount: ethers.BigNumber.from(tx.value),
        tokenDecimal: tx.tokenDecimal
    }

    if (tx.to.toLowerCase() === wallet)  //Emit errors TODO
    {
        if (!(thisToken.contractAddress in ERC20Inv))
        {
            ERC20Inv[thisToken.contractAddress] = [thisToken.tokenSymbol, utils.bigNum2Float(thisToken.amount, thisToken.tokenDecimal), thisToken.tokenDecimal]
        }
        else {ERC20Inv[thisToken.contractAddress][1] += utils.bigNum2Float(thisToken.amount, thisToken.tokenDecimal)}
    }
    if (tx.from.toLowerCase() === wallet) //Emit errors TODO 
    {
        // console.assert(thisToken.contractAddress in ERC20Inv) //this here
        try {ERC20Inv[thisToken.contractAddress][1] -= utils.bigNum2Float(thisToken.amount, thisToken.tokenDecimal)}
        catch (error)
        {
            if (error instanceof TypeError) 
            ERC20Inv[thisToken.contractAddress] = [thisToken.tokenSymbol, -1*utils.bigNum2Float(thisToken.amount, thisToken.tokenDecimal), thisToken.tokenDecimal]
        }
        if (ERC20Inv[thisToken.contractAddress][1] <= 0.001 && ERC20Inv[thisToken.contractAddress][1] >= -0.001){delete ERC20Inv[thisToken.contractAddress]}
    }
}
function processERC721(tx)
{
    thisToken = {
        contractAddress: tx.contractAddress,
        tokenID: tx.tokenID,
        tokenName: tx.tokenName,
    }

    // Add support for actually sending the token to yourself
    if ((tx.contractAddress === "0x7d9d3659dcfbea08a87777c52020bc672deece13" || 
        tx.contractAddress === "0x3aBEDBA3052845CE3f57818032BFA747CDED3fca") && 
        tx.to.toLowerCase() === wallet && tx.from.toLowerCase() === wallet)
    {
        if (!(thisToken.contractAddress in ERC721Inv))
        {
            ERC721Inv[thisToken.contractAddress] = [thisToken.tokenName, thisToken.tokenID]
        }
        else {ERC721Inv[thisToken.contractAddress].push(thisToken.tokenID)}
        return 0
    }

    if (tx.to.toLowerCase() === wallet)  //Emit errors TODO
    {
        if (!(thisToken.contractAddress in ERC721Inv))
        {
            ERC721Inv[thisToken.contractAddress] = [thisToken.tokenName, thisToken.tokenID]
        }
        else {ERC721Inv[thisToken.contractAddress].push(thisToken.tokenID)}
    }
    if (tx.from.toLowerCase() === wallet) //Emit errors TODO 
    {
        // console.log(tx)
        indexSold = ERC721Inv[thisToken.contractAddress].indexOf(thisToken.tokenID)
        if (indexSold != -1)
        {
            ERC721Inv[thisToken.contractAddress].splice(indexSold, 1)
        }
        if (ERC721Inv[thisToken.contractAddress].length == 1)
        {
            delete ERC721Inv[thisToken.contractAddress]
        }
        

        // TODO: NFT transfered in and out in the same tx

        // console.assert(thisToken.contractAddress in ERC721Inv) //this here
        // try {ERC721Inv[thisToken.contractAddress][0] -= thisToken.amount}
        // catch (error)
        // {
        //     if (error instanceof TypeError) 
        //     ERC721Inv[thisToken.contractAddress] = [-1* thisToken.amount, thisToken.tokenSymbol]
        // }
        // if (ERC721Inv[thisToken.contractAddress][0]==0){delete ERC721Inv[thisToken.contractAddress]}
    }
}
function processERC1155(tx)
{
    thisToken = {
        contractAddress: tx.contractAddress,
        tokenID: tx.tokenID,
        tokenName: tx.tokenName,
        amount: tx.tokenValue
    }

    if (tx.to.toLowerCase() === wallet)  //Emit errors TODO
    {
        if (!(thisToken.contractAddress in ERC1155Inv))
        {
            ERC1155Inv[thisToken.contractAddress] = [thisToken.tokenName]
            for (i=0;i<thisToken.amount;i++)
            {
                ERC1155Inv[thisToken.contractAddress].push(thisToken.tokenID)
            }
        }
        else
        {
            for (i=0;i<thisToken.amount;i++)
            {
                ERC1155Inv[thisToken.contractAddress].push(thisToken.tokenID)
            }
        }
    }
    if (tx.from.toLowerCase() === wallet) //Emit errors TODO 
    {

        indexSold = ERC1155Inv[thisToken.contractAddress].indexOf(thisToken.tokenID)
        if (indexSold != -1)
        {
            ERC1155Inv[thisToken.contractAddress].splice(indexSold, thisToken.amount)
        }
        if (ERC1155Inv[thisToken.contractAddress].length == 1)
        {
            delete ERC1155Inv[thisToken.contractAddress]
        }
    }
}



async function main() 
{

    txs = utils.txIterator(userTxs)
    done = false

    while(1)
    {
        // try {thisTx = txs.next()}
        // catch (error)
        // {
        //     console.log("Is loop done: ", thisTx.done)
        //     return 0
        // }

        thisTx = txs.next()
        thisDone = thisTx.done
        if (thisDone == true) 
        {

            console.log("---Process Txs DONE")
            console.log(`### YOUR INVENTORY on the ${utils.getTime(timeStamp).toString()}: ###`)
            console.log("Total Value: ", ETHInv)
            console.log("ERC20 Inventory: ", ERC20Inv)
            console.log("ERC721 Inventory: ", ERC721Inv)
            console.log("ERC1155 Inventory: ", ERC1155Inv)
            console.log("Saving these into: " + `./WALLET_${wname}_${timeStamp}.txt`)
            await utils.saveInv(wname, wallet, timeStamp, ETHInv, ERC20Inv, ERC721Inv, ERC1155Inv)
            console.log("All done, exiting")
            return 0
        }
        thisTxType = thisTx.value.txType
        // console.log("Tx: ", thisTx.value)
        // console.log("Is loop Done:", thisDone)
        // console.log("Processing Tx...")

        switch (thisTxType)
        {
            case 'Normal': 
            processNormal(thisTx.value)
            break;

            case 'Internal': 
            processInternal(thisTx.value)
            break;

            case 'ERC20': 
            processERC20(thisTx.value)
            break;

            case 'ERC721': 
            processERC721(thisTx.value)
            break;

            case 'ERC1155': 
            processERC1155(thisTx.value)
            break;
        }

        // await utils.keypress()

    }
};

module.exports = {
    main
}