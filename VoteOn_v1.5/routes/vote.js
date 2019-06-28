var express = require("express");
var middleware = require("../middleware");
var router = express.Router(),
    passport = require("passport"),
    User     = require("../models/user");
    const EC = require('elliptic').ec;
    const ec = new EC('secp256k1');

const SHA256 = require('crypto-js/sha256')
const {Block, Blockchain,Transaction} = require('../blockchain');
let voteChain = new Blockchain();

router.get("/vote",middleware.isLoggedIn,function(req,res){
if(req.user.vote===true){
res.render("vote");
  }else
   res.redirect("/home");
});


router.get("/track",function(req,res){
    res.render("track");
});


router.post("/vote", function(req, res){
    User.findByIdAndUpdate(req.user.id,{vote : false},function(err,User){
      if(err){
          console.log(err);
          res.redirect("/home");
          }else{
    var Candidate_number= req.body.cnumber;
    if(Candidate_number==1){
        var cAddress ="address1";
    }
    else if(Candidate_number==2)
    {
        cAddress="address2";
    }
    const Key= ec.keyFromPrivate(req.user.privateKey);
    const myWalletAddress =  Key.getPublic('hex');
    const tx1 = new Transaction(myWalletAddress, cAddress);
    tx1.signTransaction(Key);
    voteChain.addTransaction(tx1);
    voteChain.mineTransactions();
    console.log(JSON.stringify(voteChain,null,5));
    res.redirect("/home");
          }
    });
});

  
router.post("/track", function(req, res)
{
  var yourVote=voteChain.viewBlock(req.body.key);
  //console.log(JSON.stringify(yourVote));
 res.render("yourVote",{yourVote:yourVote});
});

module.exports = router;