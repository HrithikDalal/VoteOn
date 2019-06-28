var moment = require('moment');
const SHA256 = require('crypto-js/sha256')

class Block {
    constructor(data) {
        this.index = 0;
        this.timestamp = moment().format(); 
        this.data = data;
        this.previousHash = "0";
        this.hash = this.calculateHash();
    }

    calculateHash() {
        return SHA256(this.index + this.previousHash + this.timestamp + this.data).toString();
    }
}

class Blockchain{
    constructor() {
        this.chain = [this.createGenesis()];
    }

    createGenesis() {
        return new Block("Genesis block")
    }

    latestBlock() {
        return this.chain[this.chain.length - 1]
    }

    addBlock(newBlock){
        newBlock.index = this.latestBlock().index+1;
        newBlock.previousHash = this.latestBlock().hash;
        newBlock.hash = newBlock.calculateHash();
        this.chain.push(newBlock);
    }

    checkValid() {
        for(let i = 1; i < this.chain.length; i++) {
            const currentBlock = this.chain[i];
            const previousBlock = this.chain[i - 1];

            if (currentBlock.hash !== currentBlock.calculateHash()) {
                return false;
            }

            if (currentBlock.previousHash !== previousBlock.hash) {
                return false;
            }
        }

        return true;
    }
}

let jsChain = new Blockchain();
jsChain.addBlock(new Block({VoterId:12301, Candidate:03}));
jsChain.addBlock(new Block({VoterId:12302, Candidate:04}));

console.log(JSON.stringify(jsChain,null,5));
console.log("Is blockchain valid? " + jsChain.checkValid());