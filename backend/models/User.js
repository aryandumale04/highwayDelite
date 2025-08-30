const mongoose = require("mongoose")

const userSchema =  new mongoose.Schema({
    name : {
        type: String,
        required : true
    },
    email : {
        type:String,
        required : true,
        unique : true
    },
    otp : {
        type : String
    },
    dob :{
        type : String,
        required : true
    },
    isVerified : {
        type: Boolean,
        default :false
    }
})
module.exports = mongoose.model("User", userSchema);
