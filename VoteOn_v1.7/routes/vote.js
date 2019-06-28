var express = require("express");
var middleware = require("../middleware");
var router = express.Router(),
    passport = require("passport"),
    User     = require("../models/user"),
    Candidate     = require("../models/candidate");
    const EC = require('elliptic').ec;
    const ec = new EC('secp256k1');

const SHA256 = require('crypto-js/sha256')
const {Block, Blockchain,Transaction} = require('../blockchain');
let voteChain = new Blockchain();

router.get("/vote",/*middleware.isLoggedIn,*/ function(req,res){
    
    Candidate.find({}, function(err, allCandidates){
         if(err){
             console.log(err);
         }else {
              res.render("vote",{candidates: allCandidates});
            }
      });
});
    
    
/*if(req.user.vote===true){
res.render("vote");
  }else
   res.redirect("/home");
});
*/

router.get("/track",function(req,res){
    res.render("track");
});


router.post("/vote", function(req, res){
    User.findByIdAndUpdate(req.user.id,{vote : false},function(err,User){
        if(err){
            console.log(err);
            res.redirect("/home");
        }else{
            const cAddress =  req.body.cnumber;
            const KeyV= ec.keyFromPrivate(req.user.privateKey);
            const myWalletAddress =  KeyV.getPublic('hex');
            const tx1 = new Transaction(myWalletAddress, cAddress);
            tx1.signTransaction(KeyV);
            voteChain.addTransaction(tx1);
            voteChain.mineTransactions();
            console.log(JSON.stringify(voteChain,null,5));
            res.redirect("/home");
        }
    });
});

  
router.post("/track", function(req, res)
{            
    const Key= ec.keyFromPrivate(req.user.privateKey);
    const myWalletAddress =  Key.getPublic('hex');
    var yourVote=voteChain.getAllTransactionsForWallet(myWalletAddress);
    console.log(JSON.stringify(yourVote[0]));
    res.render("yourVote",{yourVote:yourVote[0]});
});

router.get("/results",function(req,res){
 Candidate.find({}, function(err, allCandidates){
         if(err){
             console.log(err);
         }else {
              res.render("results",{candidates: allCandidates , voteChain});
            }
      });
});

module.exports = router;