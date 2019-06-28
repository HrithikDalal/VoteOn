var mongoose = require("mongoose");
var User = require("./models/user");
const EC = require('elliptic').ec;
const ec = new EC('secp256k1');
const key = ec.genKeyPair();
const key1 = ec.genKeyPair();
const key2 = ec.genKeyPair();
var data = [
    {
    firstName   : "Hrithik",
    lastName    : "Dalal",
    email       : "hdhrithik.pk@gmail.com",
    username    : 1231,
    privateKey  : key.getPrivate('hex'),
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
 
function seedDB()
{   console.log(data[0].privateKey);
    //Remove all campgrounds
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
}

module.exports = seedDB;