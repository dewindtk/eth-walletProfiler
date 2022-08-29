dotenv = require('dotenv')
dotenv.config();
const utils = require('./utils.js');
const fetch = require('node-fetch');
const ethers = require('ethers');
wallets = require('../wallets.json')
mainScript = require("../walletProfiler")

//Only supports one wallet for now
wallet = Object.keys(wallets)[0]
wname = wallets[wallet][0]
timeStamp = wallets[wallet][1]

var Web3 = require('web3');
var web3 = new Web3(`https://eth-mainnet.alchemyapi.io/v2/${process.env.MAINNETAPIKEY}`);
const provider = new ethers.providers.JsonRpcProvider(`https://eth-mainnet.alchemyapi.io/v2/${process.env.MAINNETAPIKEY}`);

// const Web3 = require('web3');
const userTxs = require(`../WALLET_${wname}/${wname}_MERGEDTxs_${timeStamp}.json`)
const abiDecoder = require('abi-decoder');


ETHInv = 0
ERC20Inv = {}
ERC721Inv = {}
ERC1155Inv = {}


// For normal IMPORTANT: only +- value and not the tokens minted/transfered, those will be in ERC20/721
function processNormal(tx)
{
    //Using if statements to support Txs sent to thyself
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
        
        // WETH SUPPORT EXPERIMENTAERY (Buying WETH)
    if (tx.input === "0xd0e30db0" && tx.to.toLowerCase() === "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2")
    {
        if (!("0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2" in ERC20Inv))
        {
            ERC20Inv["0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2"] = ["WETH", txValue, 18]
        }
        else {ERC20Inv["0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2"][1] += txValue}
    }


    // When withdrawal, WETH to ETH, eth gets added successfully but WETH isnt deducted.
    // Decompile input to determine deducted amount.
    // WETH SUPPORT EXPERIMENTAERY (Selling WETH)
    if (tx.functionName === "withdraw(uint256 amount)" && tx.to.toLowerCase() === "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2")
    {
        
        decodedData = abiDecoder.decodeMethod(tx.input);
        txValue = parseFloat(ethers.utils.formatEther(decodedData.params[0].value))
        // console.log("before:", ERC20Inv)
        try {ERC20Inv["0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2"][1] -= txValue}
        catch (error)
        {
            if (error instanceof TypeError) 
            ERC20Inv["0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2"] = ["WETH", -1*txValue, 18]
        }
        // console.log("after", ERC20Inv)
    }
}

// TODO staking rewards (income and stuff)
// TODO if transfer in and out in the same tx, ordering might conflict with process --> hold processing and retry after next?
// --> for now using negative token amount

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
        //Add this to README some day
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

    //Etherorcs weird ERC721 implementation support (case specific) - transfer to self.
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

async function processEtherorcsLegacy()
{

    abi = [{"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"ownerOf","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"}]
    legacyOrcs = new ethers.Contract("0x7d9d3659dcfbea08a87777c52020bc672deece13", abi, provider)
    if ("0x7d9d3659dcfbea08a87777c52020bc672deece13" in ERC721Inv)
    {
        for (i=0;i<(ERC721Inv["0x7d9d3659dcfbea08a87777c52020bc672deece13"].length-1);i++)
        
            currentID = ERC721Inv["0x7d9d3659dcfbea08a87777c52020bc672deece13"][i+1]
            OwnerOf = await legacyOrcs.ownerOf(currentID)
            if (OwnerOf.toLowerCase() != wallet)
            {
                ERC721Inv["0x7d9d3659dcfbea08a87777c52020bc672deece13"].splice(i+1,1)
                i--
            }
        }

        if (ERC721Inv["0x7d9d3659dcfbea08a87777c52020bc672deece13"].length == 1)
        {
            delete ERC721Inv["0x7d9d3659dcfbea08a87777c52020bc672deece13"]
        }
    }

}



async function main() 
{

    txs = utils.txIterator(userTxs)
    done = false
    
    //WETH ABI link
    const WETHABI = await fetch(`https://api.etherscan.io/api?module=contract&action=getabi&address=0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2&apikey=${process.env.ETHERSCANAPIKEY}`)
    const WETHABIJSON = await WETHABI.json()
    const WETHABIJSONRESULT = JSON.parse(WETHABIJSON.result)
    abiDecoder.addABI(WETHABIJSONRESULT);

    while(1)
    {
        // For debugging
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
            //Etherorcs Legacy Inventory update
            await processEtherorcsLegacy();

            // console.log("---Process Txs DONE")
            // console.log(`### YOUR INVENTORY on the ${utils.getTime(timeStamp).toString()}: ###`)
            // console.log("Total Value: ", ETHInv)
            // console.log("ERC20 Inventory: ", ERC20Inv)
            // console.log("ERC721 Inventory: ", ERC721Inv)
            // console.log("ERC1155 Inventory: ", ERC1155Inv)
            // console.log("Saving these into: " + `./WALLET_${wname}_${timeStamp}.txt`)
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

        // For debugging
        // await utils.keypress()

    }
};

module.exports = {
    main
}