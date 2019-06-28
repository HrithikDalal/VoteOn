require('dotenv').config();
var express               = require("express"),
    app                   = express(),
    moment                = require('moment'),
    mongoose              = require("mongoose"),
    passport              = require("passport"),
    bodyParser            = require("body-parser"),
    LocalStrategy         = require("passport-local"),
    passportLocalMongoose = require("passport-local-mongoose"),
    flash                 = require("connect-flash"),
    User                  = require("./models/user");


var indexRoutes           = require("./routes/index"),
    voteRoutes            = require("./routes/vote");

const {Block, Blockchain,Transaction} = require('./blockchain');


mongoose.connect("mongodb://localhost:27017/VoteOn",{useNewUrlParser: true});
app.set("view engine","ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + "/public"));
app.use(flash());


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

app.use(function(req,res,next){
   res.locals.currentUser= req.user;
   res.locals.error=req.flash("error");
   res.locals.success=req.flash("success");
   next();
});

let voteChain = new Blockchain();

app.get("/results",function(req,res){
 console.log(`Balance of Candidate 1 is ${voteChain.getBalanceOfAddress("address1")}`); 
 console.log(`Balance of Candidate 2 is ${voteChain.getBalanceOfAddress("address2")}`); 
 res.redirect("/home");
});


app.use("/", indexRoutes);
app.use("/", voteRoutes);

app.listen(process.env.PORT, process.env.IP,function(){
    console.log("VoteOn server has Started!");
});