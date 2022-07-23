wallets = require('../wallets.json')
dotenv = require('dotenv')
dotenv.config();

//Only supports one wallet for now

wallet = Object.keys(wallets)[0]
wname = wallets[wallet][0]

const fetch = require('node-fetch');
const NormalTxs = `https://api.etherscan.io/api?module=account&action=txlist&address=${wallet}&startblock=0&endblock=99999999&page=1&offset=9000&sort=asc&apikey=${process.env.ETHERSCANAPIKEY}`
const InternalTxs = `https://api.etherscan.io/api?module=account&action=txlistinternal&address=${wallet}&startblock=0&endblock=99999999&page=1&offset=9000&sort=asc&apikey=${process.env.ETHERSCANAPIKEY}`
const ERC20Txs = `https://api.etherscan.io/api?module=account&action=tokentx&address=${wallet}&page=1&offset=9000&startblock=0&endblock=99999999&sort=asc&apikey=${process.env.ETHERSCANAPIKEY}`
const ERC721Txs = `https://api.etherscan.io/api?module=account&action=tokennfttx&address=${wallet}&page=1&offset=9000&startblock=0&endblock=99999999&sort=asc&apikey=${process.env.ETHERSCANAPIKEY}`
const ERC1155Txs = `https://api.etherscan.io/api?module=account&action=token1155tx&address=${wallet}&page=1&offset=9000&startblock=0&endblock=99999999&sort=asc&apikey=${process.env.ETHERSCANAPIKEY}`
const fs = require('fs')

// TODO Concat these 5 functions? --> To Utils
async function fetchNormalTxs() 
{
    const response = await fetch(NormalTxs)
    const resJson = await response.json()
    data = resJson.result
    if (data == null){data = []}

    for (i=0;i<data.length;i++)
    {
        data[i].txType = 'Normal'
    }

    // console.log(data)
    await fs.promises.writeFile(`./WALLET_${wname}/${wname}_NormalTxs.json`, JSON.stringify(data), (err) => {
        if (err) {
            throw err;
        }
    });

};

async function fetchInternalTxs()
{

    const response = await fetch(InternalTxs)
    const resJson = await response.json()
    data = resJson.result
    if (data == null){data = []}

    for (i=0;i<data.length;i++)
    {
        data[i].txType = 'Internal'
    }

    // console.log(data)
    await fs.promises.writeFile(`./WALLET_${wname}/${wname}_InternalTxs.json`, JSON.stringify(data), (err) => {
        if (err) {
            throw err;
        }
    });
    
}

async function fetchERC20Txs() 
{

    const response = await fetch(ERC20Txs)
    const resJson = await response.json()
    data = resJson.result
    if (data == null){data = []}

    for (i=0;i<data.length;i++)
    {
        data[i].txType = 'ERC20'
    }

    // console.log(data)
    await fs.promises.writeFile(`./WALLET_${wname}/${wname}_ERC20Txs.json`, JSON.stringify(data), (err) => {
        if (err) {
            throw err;
        }
    });
    
}

async function fetchERC721Txs()
{

    const response = await fetch(ERC721Txs)
    const resJson = await response.json()
    data = resJson.result
    if (data == null){data = []}

    for (i=0;i<data.length;i++)
    {
        data[i].txType = 'ERC721'
    }

    // console.log(data)
    await fs.promises.writeFile(`./WALLET_${wname}/${wname}_ERC721Txs.json`, JSON.stringify(data), (err) => {
        if (err) {
            throw err;
        }
    });
    
}

async function fetchERC1155Txs()
{

    const response = await fetch(ERC1155Txs)
    const resJson = await response.json()
    data = resJson.result
    if (data == null){data = []}

    for (i=0;i<data.length;i++)
    {
        data[i].txType = 'ERC1155'
    }

    // console.log(data)
    await fs.promises.writeFile(`./WALLET_${wname}/${wname}_ERC1155Txs.json`, JSON.stringify(data), (err) => {
        if (err) {
            throw err;
        }
    });
    
}

async function main()
{
    await fetchNormalTxs();
    await fetchInternalTxs();
    await fetchERC20Txs();
    await fetchERC721Txs();
    await fetchERC1155Txs();
}

module.exports = {
    main
}