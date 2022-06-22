//Start with file names and then organize created files better - sliced merged etc cut with Date!

wallets = require('../wallets.json')
//Only supports one wallet for now
wallet = Object.keys(wallets)[0]
wname = wallets[wallet][0]
timeStamp = wallets[wallet][1]

userNormalTxs = require(`../WALLET_${wname}/${wname}_NormalTxs.json`);
userInternalTxs = require(`../WALLET_${wname}/${wname}_InternalTxs.json`);
userERC20Txs = require(`../WALLET_${wname}/${wname}_ERC20Txs.json`);
userERC721Txs = require(`../WALLET_${wname}/${wname}_ERC721Txs.json`);
userERC1155Txs = require(`../WALLET_${wname}/${wname}_ERC1155Txs.json`);
const fs = require('fs');
const utils = require('./utils.js')

async function concat(dataJsons) //Input Array of TxJsons
{

    //Merge json Arrays to single Array
    mergedUnordered = []
    for (i=0;i<dataJsons.length;i++)
    {
        mergedUnordered = mergedUnordered.concat(dataJsons[i])
    }

    //Sort Txs in merged Array by timeStamp
    mergedOrdered = mergedUnordered.sort(function(a, b) {
        var keyA = a.timeStamp,
          keyB = b.timeStamp;
        // Compare the 2 dates
        if (keyA < keyB) return -1;
        if (keyA > keyB) return 1;
        return 0;
    });


    await fs.promises.writeFile(`./WALLET_${wname}/${wname}_MERGEDTxs_ALL.json`, JSON.stringify(mergedOrdered), (err) => {
        if (err) {
            throw err;
        }
    return 0
    });

}

async function discardTimestamp(arr, stamp)
{
    finalArr = arr.slice(0, utils.findIndex2Exclude(arr, stamp))
    await fs.promises.writeFile(`./WALLET_${wname}/${wname}_MERGEDTxs_${stamp}.json`, JSON.stringify(finalArr), (err) => {
        if (err) {
            throw err;
        }
    });
    return 0
}

async function main()
{
    await concat([userNormalTxs, userInternalTxs, userERC20Txs, userERC721Txs, userERC1155Txs]);
    userMERGEDTxs = require(`../WALLET_${wname}/${wname}_MERGEDTxs_ALL.json`);
    await discardTimestamp(userMERGEDTxs, timeStamp);
}


module.exports = {
    main
}
// concat([userNormalTxs, userInternalTxs, userERC20Txs, userERC721Txs, userERC1155Txs]);
// discardTimestamp(userMERGEDTxs, 1640991599);