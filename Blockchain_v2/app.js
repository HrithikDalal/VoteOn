const { Blockchain, Transaction } = require('./blockchain');
const EC = require('elliptic').ec;
const ec = new EC('secp256k1');

const myKey = ec.keyFromPrivate('7c4c45907dec40c91bab3480c39032e90049f1a44f3e18c3e07c23e3273995cf');
const myWalletAddress = myKey.getPublic('hex');

const voteOn = new Blockchain();

const tx1 = new Transaction(myWalletAddress, 'address2');
tx1.signTransaction(myKey);
voteOn.addTransaction(tx1);
voteOn.mineTransactions();

const tx2 = new Transaction(myWalletAddress, 'address2');
tx2.signTransaction(myKey);
voteOn.addTransaction(tx2);

voteOn.mineTransactions();

console.log();
console.log(`Balance of Voter is ${voteOn.getBalanceOfAddress(myWalletAddress)}`);
console.log(`Balance of Candidate is ${voteOn.getBalanceOfAddress("address2")}`);

console.log(JSON.stringify(voteOn,null,5));

console.log();
console.log('Blockchain valid?', voteOn.isChainValid() ? 'Yes' : 'No');
