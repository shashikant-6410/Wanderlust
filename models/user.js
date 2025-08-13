const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");

const Schema = mongoose.Schema;

const userSchema = new Schema({  //passportLocalMongoose by default adds username and password 
    email:{
        type:String,
        required:true
    }
})


userSchema.plugin(passportLocalMongoose);

module.exports = new mongoose.model("User",userSchema);

