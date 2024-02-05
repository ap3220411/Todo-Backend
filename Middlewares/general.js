const jwt = require("jsonwebtoken")

function checkBodyPara(req, res, next){

    const {email,password,name} = req.body;

    if(!email || !password || !name )
    return res.json({success : false , message :"Invalid data"})

    if (password.length < 8)
    return res.json({success : false , message :"wrong password"})

    if (name.length <= 1)
    return res.json({success : false , message :"Invalid name"})

    if (email.length < 6)
    return res.json({success : false , message :"Invalid email"})


next()
}

function islogin(req, res,next){

    const Token = req.headers.authorization;
     
    try {
        var data = jwt.verify(Token , "xyz");

        //this is method to passing data middleware to controllor
        req.TokenData =data
       return next()
        }

catch(err){
 res.json({ success:false ,message: err.message})
}
};



module.exports = {checkBodyPara,islogin};