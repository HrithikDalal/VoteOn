var mongoose              = require("mongoose"),
    passportLocalMongoose = require("passport-local-mongoose");

var UserSchema = new mongoose.Schema({
    firstName           : {type: String, required: true},
    lastName            : String,
    username            : {type: Number, unique: true, required: true},
    email               : {type: String, unique: true, required: true},
    password            : String,
    avatar              : String,
    isAdmin             : {type : Boolean, default: false},
    vote                : {type : Boolean, default: true},
    resetPasswordToken  : String,
    resetPasswordExpires: Date,
    privateKey          : String,
    
});
UserSchema.plugin(passportLocalMongoose);
module.exports= mongoose.model("User", UserSchema);