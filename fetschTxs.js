const fetch = require('node-fetch');
const kaikunNormalTxs = 'https://api.etherscan.io/api?module=account&action=txlist&address=0xbC5126Ea9D3A9b7e8353051DC646bfC4fC65c1F7&startblock=0&endblock=99999999&page=1&offset=3000&sort=asc&apikey=FZNRAKKI5G24D4YP61TM22FUGWSQH4JXKN'
const kaikunInternalTxs = 'https://api.etherscan.io/api?module=account&action=txlistinternal&address=0xbC5126Ea9D3A9b7e8353051DC646bfC4fC65c1F7&startblock=0&endblock=99999999&page=1&offset=3000&sort=asc&apikey=FZNRAKKI5G24D4YP61TM22FUGWSQH4JXKN'
const kaikunERC20Txs = 'https://api.etherscan.io/api?module=account&action=tokentx&address=0xbC5126Ea9D3A9b7e8353051DC646bfC4fC65c1F7&page=1&offset=3000&startblock=0&endblock=99999999&sort=asc&apikey=FZNRAKKI5G24D4YP61TM22FUGWSQH4JXKN'
const kaikunERC721Txs = 'https://api.etherscan.io/api?module=account&action=tokennfttx&address=0xbC5126Ea9D3A9b7e8353051DC646bfC4fC65c1F7&page=1&offset=3000&startblock=0&endblock=99999999&sort=asc&apikey=FZNRAKKI5G24D4YP61TM22FUGWSQH4JXKN'
const kaikunERC1155Txs = 'https://api.etherscan.io/api?module=account&action=token1155tx&address=0xbC5126Ea9D3A9b7e8353051DC646bfC4fC65c1F7&page=1&offset=3000&startblock=0&endblock=99999999&sort=asc&apikey=FZNRAKKI5G24D4YP61TM22FUGWSQH4JXKN'
const fs = require('fs')


async function fetchNormalTxs() 
{
    const response = await fetch(kaikunNormalTxs)
    const resJson = await response.json()
    data = resJson.result

    for (i=0;i<data.length;i++)
    {
        data[i].txType = 'Normal'
    }

    console.log(data)
    fs.writeFile('kaikunNormalTxs.json', JSON.stringify(data), (err) => {
        if (err) {
            throw err;
        }
    });

};

async function fetchInternalTxs()
{

    const response = await fetch(kaikunInternalTxs)
    const resJson = await response.json()
    data = resJson.result

    for (i=0;i<data.length;i++)
    {
        data[i].txType = 'Internal'
    }

    console.log(data)
    fs.writeFile('kaikunInternalTxs.json', JSON.stringify(data), (err) => {
        if (err) {
            throw err;
        }
    });
    
}

async function fetchERC20Txs() 
{

    const response = await fetch(kaikunERC20Txs)
    const resJson = await response.json()
    data = resJson.result

    for (i=0;i<data.length;i++)
    {
        data[i].txType = 'ERC20'
    }

    console.log(data)
    fs.writeFile('kaikunERC20Txs.json', JSON.stringify(data), (err) => {
        if (err) {
            throw err;
        }
    });
    
}

async function fetchERC721Txs()
{

    const response = await fetch(kaikunERC721Txs)
    const resJson = await response.json()
    data = resJson.result

    for (i=0;i<data.length;i++)
    {
        data[i].txType = 'ERC721'
    }

    console.log(data)
    fs.writeFile('kaikunERC721Txs.json', JSON.stringify(data), (err) => {
        if (err) {
            throw err;
        }
    });
    
}

async function fetchERC1155Txs()
{

    const response = await fetch(kaikunERC1155Txs)
    const resJson = await response.json()
    data = resJson.result

    for (i=0;i<data.length;i++)
    {
        data[i].txType = 'ERC1155'
    }

    console.log(data)
    fs.writeFile('kaikunERC1155Txs.json', JSON.stringify(data), (err) => {
        if (err) {
            throw err;
        }
    });
    
}

fetchNormalTxs();
fetchInternalTxs();
fetchERC20Txs();
fetchERC721Txs();
fetchERC1155Txs();




//// Old fetch method ////
//   fetch(kaikunNormalTxs)
//     .then(function(response) {
//         return response.json();
//     })
//     .then(function(resp) {
//         data = JSON.parse(JSON.stringify(resp.result));

//         fs.writeFile('kaikunNormalTxs.json', JSON.stringify(data), (err) => {
//             if (err) {
//                 throw err;
//             }
//         });
//     });