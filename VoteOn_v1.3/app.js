var express               = require("express"),
    app                   = express(),
    moment                = require('moment'),
    mongoose              = require("mongoose"),
    passport              = require("passport"),
    bodyParser            = require("body-parser"),
    LocalStrategy         = require("passport-local"),
    passportLocalMongoose = require("passport-local-mongoose"),
    User                  = require("./models/user");


const SHA256 = require('crypto-js/sha256')
const {Block, Blockchain,Transaction} = require('./blockchain');
const EC = require('elliptic').ec;
const ec = new EC('secp256k1');

mongoose.connect("mongodb://localhost:27017/VoteOn",{useNewUrlParser: true});

app.set("view engine","ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + "/public"));


//PASSPORT CONFIGURATION
app.use(require("express-session")({
    secret:"This is my secret",
    resave:false,
    saveUninitialized:false
}));

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req,res,next){
   res.locals.currentUser= req.user;
   next();
});

let voteChain = new Blockchain();


//ROUTES
app.get("/",function(req,res){
    res.render("landing");
});


app.get("/home",function(req,res){
    res.render("home");
});


app.get("/vote",isLoggedIn,function(req,res){
if(req.user.vote===true){
res.render("vote");
  }else
   res.redirect("/home");
});


app.get("/track",function(req,res){
    res.render("track");
});


app.post("/vote", function(req, res){
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
    console.log(req.user.id);
    
});

  
app.post("/track", function(req, res)
{
  var yourVote=voteChain.viewBlock(req.body.key);
  //console.log(JSON.stringify(yourVote));
 res.render("yourVote",{yourVote:yourVote});
});


app.get("/results",function(req,res){
 console.log(`Balance of Candidate 1 is ${voteChain.getBalanceOfAddress("address1")}`); 
 console.log(`Balance of Candidate 2 is ${voteChain.getBalanceOfAddress("address2")}`); 
 res.redirect("/home");
});


app.get("/register",function(req,res){
    res.render("register");
});


app.post("/register",function(req,res){
    const key = ec.genKeyPair();
    var newUser = new User(
        {
            firstName : req.body.firstName,
            lastName : req.body.lastName,
            email :req.body.email,
            username: req.body.username,
            privateKey :  key.getPrivate('hex')
        });
    User.register(newUser, req.body.password, function(err,user){
        if(err)
        {
            return res.render("register");
        }
            passport.authenticate("local")(req,res,function(){
                res.redirect("/home");
            });
    });
});



//LoginRoutes
//render login form
app.get("/login",function(req,res){
    res.render("login");
});


//handling user login
app.post("/login",passport.authenticate("local",{
    successRedirect:"/home",
    failureRediretc:"/login"
}),function(req,res){
});

//Logout
app.get("/logout",function(req,res){
   req.logout();
   res.redirect("/");
});


//middleware
function isLoggedIn(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}


app.listen(process.env.PORT, process.env.IP,function(){
    console.log("VoteOn server has Started!");
});