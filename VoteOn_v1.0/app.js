var express = require("express");
var app = express();
var moment = require('moment');
var bodyParser = require("body-parser");
const SHA256 = require('crypto-js/sha256')
const {Block, Blockchain} = require('./blockchain');



app.set("view engine","ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + "/public"));


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
  voteChain.addBlock(new Block(vote));
  console.log(JSON.stringify(voteChain,null,5));
  console.log("Is blockchain valid? " + voteChain.checkValid());
   res.redirect("/home");
});
  
app.post("/track", function(req, res)
{
  var yourVote=voteChain.viewBlock(req.body.key);
   res.render("yourVote", {yourVote : yourVote});
});



app.listen(process.env.PORT, process.env.IP,function(){
    console.log("VoteOn server has Started!");
});