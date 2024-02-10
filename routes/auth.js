const express = require("express");
const router = express.Router();

const {login , signup , activateAccount,otpSend,changePassword} = require("../controllers/auth");

router.post("/login"  ,login)
router.post("/signup"  ,signup)
router.get("/Active/:Token" ,activateAccount);

router.post("/otp-send" ,otpSend);
router.post("/change-password" ,changePassword);

module.exports = router ;

