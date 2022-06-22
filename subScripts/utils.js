const kaikun = "0xbC5126Ea9D3A9b7e8353051DC646bfC4fC65c1F7".toLocaleLowerCase()
const ethers = require('ethers');



function getTime(epoch)
{
    var d = new Date(0); // The 0 there is the key, which sets the date to the epoch
    d.setUTCSeconds(epoch)
    console.log(d.toString())
    return d
}

function* txIterator(data)
{
    for (let i = 0;i<data.length;i++)
    {
        yield data[i];
    }

}
const keypress = async () => 
{
    process.stdin.setRawMode(true)
    return new Promise(resolve => process.stdin.once('data', data => {
      const byteArray = [...data]
      if (byteArray.length > 0 && byteArray[0] === 3) {
        console.log('^C')
        process.exit(1)
      }
      process.stdin.setRawMode(false)
      resolve()
    }))
}

function findIndex2Exclude(arr, stamp) // BRO pls make this more efficient ffs
{
    i = 0
    while(arr[i].timeStamp < stamp)
    {
        i++ ;
    }
    return i
}


function bigNum2Float(bignum, deci)
{
    return parseFloat(bignum.toString())/parseFloat((ethers.BigNumber.from(10).pow(parseInt(deci))).toString())
}

module.exports = {
    kaikun,
    getTime, 
    txIterator, 
    keypress, 
    findIndex2Exclude,
    bigNum2Float
};