const express = require("express");
const router = express.Router();

const {login , signup , activateAccount} = require("../controllers/auth");

router.post("/login"  ,login)
router.post("/signup"  ,signup)
router.get("/Active/:Token" ,activateAccount)

module.exports = router ;

