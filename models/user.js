const mongoose = require("mongoose");


const UserSchema = new mongoose.Schema({
    name: String,
    email: {
        type: String,
        unique: true
    },
    emailVerify: {
        type: Boolean,
        default: false,
        required: true
    },
    password: {
        type:String,
        required:true
    }
});


module.exports = mongoose.model("UserTodo", UserSchema);