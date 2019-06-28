var mongoose              = require("mongoose");

var CandidateSchema = new mongoose.Schema({
    username            : {type: Number, unique: true, required: true},
    firstName           : {type: String, required: true},
    lastName            : String,
    partyName           : String,
    avatar              : String,
    publicAddress       : String
});
module.exports= mongoose.model("Candidate", CandidateSchema);