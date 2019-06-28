var moment = require('moment');
const SHA256 = require('crypto-js/sha256')

class Block 
{
    constructor(data)
    {
        this.index = 0;
        this.timestamp = moment().format(); 
        this.data = data;
        this.previousHash = "0";
        this.hash = this.calculateHash();
        this.nonce = 0;
    }

    calculateHash()
    {
        return SHA256(this.index + this.previousHash + this.timestamp + this.data+ this.nonce).toString();
    }
    
    mineBlock(difficulty)
    {
        while (this.hash.substring(0, difficulty) !== Array(difficulty + 1).join('0')) 
        {
            this.nonce++;
            this.hash = this.calculateHash();
            
        }
    }
    
}


class Blockchain
{
    constructor()
    {
        this.chain = [this.createGenesis()];
        this.difficulty = 3;
    }

    createGenesis()
    {
        return new Block("Genesis block")
    }

    latestBlock() {
        return this.chain[this.chain.length - 1]
    }

    addBlock(newBlock)
    {
        newBlock.index = this.latestBlock().index+1;
        newBlock.previousHash = this.latestBlock().hash;
        newBlock.mineBlock(this.difficulty);
        this.chain.push(newBlock);
    }

    checkValid()
    {
        for(let i = 1; i < this.chain.length; i++)
        {
            const currentBlock = this.chain[i];
            const previousBlock = this.chain[i - 1];

            if (currentBlock.hash !== currentBlock.calculateHash())
            {
                return false;
            }

            if (currentBlock.previousHash !== previousBlock.hash)
            {
                return false;
            }
        }

        return true;
    }
    
    viewBlock(bHash)
    {
        for(let i = 0; i < this.chain.length; i++)
        {
            const currentBlock = this.chain[i];
            if(bHash===currentBlock.hash)
            {
               return(this.chain[i].data);
            }
        }return "Block Not found";
    }
}

module.exports = 
{
  Block:Block,
  Blockchain:Blockchain
}