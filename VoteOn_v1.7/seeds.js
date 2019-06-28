var mongoose = require("mongoose");
var User = require("./models/user");
var Candidate = require("./models/candidate");
const EC = require('elliptic').ec;
const ec = new EC('secp256k1');
const key = ec.genKeyPair();
const key1 = ec.genKeyPair();
const key2 = ec.genKeyPair();
const keyC = ec.genKeyPair();
const keyC1 = ec.genKeyPair();
const keyC2 = ec.genKeyPair();
var data = [
    {
    firstName   : "Hrithik",
    lastName    : "Dalal",
    email       : "hdhrithik.pk@gmail.com",
    username    : 1231,
    privateKey  : key.getPrivate('hex'),
    isAdmin     : true 
    },
    {
    firstName   : "Harry",
    lastName    : "Potter",
    email       : "hrithiknotroshan@gmail.com",
    username    : 1232,
    privateKey  : key1.getPrivate('hex'),
    },
    {
    firstName   : "Akash",
    lastName    : "Sharma",
    email       : "aki.srma@gmail.com",
    username    : 1233,
    privateKey  : key2.getPrivate('hex'),
    }
    
];
var dataC= [
    {
    username    : 1,
    firstName   : "Lord",
    lastName    : "Voldermot",
    partyName    : "AAP",
   publicAddress  : keyC.getPublic('hex'),
    },
    {
    username    : 2,
    firstName   : "Night",
    lastName    : "King",
    partyName    : "BJP",
   publicAddress  : keyC1.getPublic('hex'),
    },
    {
    username    : 3,
    firstName   : "Thanos",
    partyName    : "Congress",
   publicAddress  : keyC2.getPublic('hex'),
    }
    
];
 
function seedDB()
{  
    //Remove all users
    User.remove({}, function(err)
    {
        if(err)
        {
            console.log(err);
        }
        console.log("removed users!");
        //add a few users
        data.forEach(function(seed)
        {
            User.create(seed, function(err, user){
                if(err)
                {
                    console.log(err)
                }else {
                        console.log("added a User");
                        user.save();
                }
            });
        });
    });
     //Remove all Candidates
    Candidate.remove({}, function(err)
    {
        if(err)
        {
            console.log(err);
        }
        console.log("removed candidates!");
        //add a few users
        dataC.forEach(function(seedC)
        {
            Candidate.create(seedC, function(err, candidate){
                if(err)
                {
                    console.log(err)
                }else {
                        console.log("added a Candidate");
                        candidate.save();
                }
            });
        });
    });
}

module.exports = seedDB;