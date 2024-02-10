
const mongoose = require("mongoose");


const otpSchema = new mongoose.Schema({

    email: {
        type: String,
        required: true,

    },
    code: {
        type: String,
        required: true,
    },
    expirationTime: { type: Date, required: true }

});


module.exports = mongoose.model("otp", otpSchema);