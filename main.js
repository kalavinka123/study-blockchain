const SHA256 = require('crypto-js/sha256')

class Block {
    constructor(index, timestamp, data, prevhash = '') {
        this.index = index;
        this.timestamp = timestamp;
        this.data = data;
        this.prevhash = prevhash;
        this.hash = this.calculateHash();
        this.nonce = 0;
    }

    calculateHash() {
        return SHA256(this.index + this.prevhash + this.timestamp + JSON.stringify(this.data) + this.nonce).toString()
    }

    mindBlock(difficulty) {
        while(this.hash.substring(0, difficulty) !== Array(difficulty + 1).join("0")) {
            this.nonce++;
            this.hash = this.calculateHash();
        }

        console.log("Block minded: " + this.hash);
    }
}

class BlockChain {
    constructor() {
        this.chain = [this.createGenesisBlock()];
        this.difficulty = 5;
    }

    createGenesisBlock() {
        return new Block(0, "01/01/2025", "Genesis Block", "0")
    }

    getLatestBlock() {
        return this.chain[this.chain.length - 1]
    }

    /** In realiy, adding a new block entails a series of checks. */
    addBlock(newBlock) {
        newBlock.prevhash = this.getLatestBlock().hash;
        newBlock.mindBlock(this.difficulty);
        this.chain.push(newBlock);
    }

    isChainValid() {
        // Skipping the block 0, as it's genesis block.
        for(let i = 1; i < this.chain.length; i++) {
            const currentBlock = this.chain[i];
            const previousBlock = this.chain[i - 1];

            if(currentBlock.hash !== currentBlock.calculateHash()) {
                return false;
            }

            if(currentBlock.prevhash !== previousBlock.hash) {
                return false;
            }
        }

        return true;
    }
}

let juCoin = new BlockChain();

console.log("Mining block ...")
juCoin.addBlock(new Block(1, "05/01/2025", { amount: 10 }));

console.log("Mining block ...")
juCoin.addBlock(new Block(2, "06/05/2025", { amount: 50 }));

// Confirming the content of the chain.
console.log(JSON.stringify(juCoin, null, 4));

// Checking the validity of the chain
// console.log("Is Blockchain valid? " + juCoin.isChainValid());

// Tampering data
// juCoin.chain[1].data = { amount: 3000 };
// juCoin.chain[1].hash = juCoin.chain[1].calculateHash();
// console.log("Is Blockchain valid? " + juCoin.isChainValid());


