//Start with file names and then organize created files better - sliced merged etc

kaikunNormalTxs = require('./kaikunTxs/kaikunNormalTxs.json');
kaikunInternalTxs = require('./kaikunTxs/kaikunInternalTxs.json');
kaikunERC20Txs = require('./kaikunTxs/kaikunERC20Txs.json');
kaikunERC721Txs = require('./kaikunTxs/kaikunERC721Txs.json');
kaikunERC1155Txs = require('./kaikunTxs/kaikunERC1155Txs.json');
const fs = require('fs');
kaikunMERGEDTxs = require('./kaikunTxs/kaikunMergedTxs.json');
const utils = require('./utils.js')

function concat(dataJsons) //Input Array of TxJsons
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


    fs.writeFile('./kaikunTxs/kaikunMergedTxs.json', JSON.stringify(mergedOrdered), (err) => {
        if (err) {
            throw err;
        }
    });

}

function discardTimestamp(arr, stamp)
{
    finalArr = arr.slice(0, utils.findIndex2Exclude(arr, stamp))
    fs.writeFile('./kaikunTxs/kaikunMergedSlicedTxs.json', JSON.stringify(finalArr), (err) => {
        if (err) {
            throw err;
        }
    });
}

// concat([kaikunNormalTxs, kaikunInternalTxs, kaikunERC20Txs, kaikunERC721Txs, kaikunERC1155Txs]);
// discardTimestamp(kaikunMERGEDTxs, 1640991599);