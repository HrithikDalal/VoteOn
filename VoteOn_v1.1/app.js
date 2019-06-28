var express = require("express");
var app = express();
var moment = require('moment');
var bodyParser = require("body-parser");
const SHA256 = require('crypto-js/sha256')
const {Block, Blockchain,Transaction} = require('./blockchain');
const EC = require('elliptic').ec;
const ec = new EC('secp256k1');



app.set("view engine","ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + "/public"));


const Key1 = ec.keyFromPrivate('6a97573898ab7aaebd4d23d28206f3dbaa2872cd5c832105750ce0d9225e660f');
const Key2 = ec.keyFromPrivate('a58f9c547908fd11753c7e1d9db6bd7879d740391212446ce21237dd693b1ba0');
const Key3 = ec.keyFromPrivate('ea74ff1b8768e500574dc62aff0756662ee0ab03508974514107aa0b0a3a2d4b');

let voteChain = new Blockchain();


//ROUTES
app.get("/",function(req,res){
    res.render("landing");
});


app.get("/home",function(req,res){
    res.render("home");
});


app.get("/vote",function(req,res){
    res.render("vote");
});


app.get("/track",function(req,res){
    res.render("track");
});


app.post("/vote", function(req, res){
 var vote = 
  {
      Voter_name: req.body.vname,
      Candidate_number: req.body.cnumber
  }
  if(vote.Voter_name==="Hrithik"){
      const myWalletAddress = Key1.getPublic('hex');
      const tx1 = new Transaction(myWalletAddress, 'address2');
    tx1.signTransaction(Key1);
    voteChain.addTransaction(tx1);
    voteChain.mineTransactions();
    console.log(JSON.stringify(voteChain,null,5));
}
 else  if(vote.Voter_name==="Akash"){
      const myWalletAddress = Key2.getPublic('hex');
      const tx1 = new Transaction(myWalletAddress, 'address2');
    tx1.signTransaction(Key2);
    voteChain.addTransaction(tx1);
    voteChain.mineTransactions();
    console.log(JSON.stringify(voteChain,null,5));
}
 else  if(vote.Voter_name==="Bixby"){
      const myWalletAddress = Key3.getPublic('hex');
      const tx1 = new Transaction(myWalletAddress, 'address2');
    tx1.signTransaction(Key3);
    voteChain.addTransaction(tx1);
    voteChain.mineTransactions();
    console.log(JSON.stringify(voteChain,null,5));
}
   res.redirect("/home");
});
  
app.post("/track", function(req, res)
{
  var yourVote=voteChain.viewBlock(req.body.key);
  console.log(JSON.stringify(yourVote));
 res.render("yourVote",{yourVote:yourVote});
});



app.listen(process.env.PORT, process.env.IP,function(){
    console.log("VoteOn server has Started!");
});