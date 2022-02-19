const mongoose = require("mongoose");

const UserSchema = mongoose.Schema({
    userId:{
        type:String,
        required:true,
    },
    userMail: {
        type: String,
        required: true,
    },
    passWord: {
        type:String,
        required: true,
    }
});

module.exports = mongoose.model("User", UserSchema);