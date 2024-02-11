const bcrypt = require("bcrypt")
const nodemailer = require("nodemailer")
const jwt = require("jsonwebtoken")
const User = require("../models/user")
const Otp = require("../models/otp")

const dotenv = require("dotenv")
dotenv.config()

const signup = (req, res) => {

    const { name, email, password } = req.body;
    //if account with email already exists
    User.findOne({ email: req.body.email })
        .then((user) => {


            //if email exixt return the response from here only
            if (user) {
                return res.json({ success: false, message: "Email is already in used" });
            }
            // if email is new then first we will has the  password

            bcrypt.hash(password, 10, (err, hash) => {
                if (err)
                    return res.json({ success: false, message: err.message });

                //create user in database

                User.create({ email: email, name: name, password: hash })

                    .then((user) => {
                        //if account is created successfully verify email


                        //generate token 
                        const Token = jwt.sign({ id: user._id }
                            , "xyz");

                        //send token in email
                        var transporter = nodemailer.createTransport({
                            service: 'gmail',
                            auth: {
                                user: process.env.EMAIL,
                                pass: process.env.PASSWORD
                            }
                        });

                        var mailOptions = {
                            from: process.env.EMAIL,
                            to: user.email,
                            subject: 'Active Your Todo Account',
                            html: `<p> hey! ${user.name}, You Wll be created You Todo Account Plz Verify Your Account in following ink </p>
                                <a href="${process.env.BACKEND_URL}/auth/Active/${Token}">Activate Account</a> `
                        };


                        transporter.sendMail(mailOptions, function (error, info) {
                            if (error) {

                                return res.json({ success: false, message: "error occured" + error.message });
                            } else {
                                return res.json({ success: true, message: "An Account Active link send mail " })
                            }
                        });



                    })
                    .catch((err) => res.json({ success: false, message: err.message }))
            })

        })
        .catch((err) => res.json({ success: true, message: err.message }));

}

const login = (req, res) => {

    const { email, password } = req.body;

    //check If account Exists
    User.findOne({ email: email })
        .then((user) => {
            if (!user) {
                return res.json({ success: false, message: "Email not found" })
            }

            //if user exixt we will check email  verify or not


            if (user.emailVerify == false) {
                return res.json({ success: false, message: "First Verify your account ny the sending email" })

            }

            //if user exists  then compare password

            bcrypt.compare(password, user.password, (err, result) => {
                if (result == true) {

                    //if password verified seccessfully
                    //then  sign a token
                    const Token = jwt.sign({ name: user.name, email: user.email, id: user._id }
                        , "xyz");

                    return res.json({ success: true, message: "Login successfully", Token, name: user.name })
                }
                else {

                    return res.json({ success: false, message: "Wrong Password" })
                }
            })
        })

        .catch((err) => res.json({ success: false, message: err.message }));

};

const activateAccount = (req, res) => {

    const Token = req.params.Token;
    //try to verify token
    try {
        const data = jwt.verify(Token, "xyz");
        console.log(data)

        //try to find user now
        User.findByIdAndUpdate(data.id, { emailVerify: true })
            .then(() => {
                res.json({ success: true, message: "Account is now active. You can log in to your account" })
                ;
            })
            .catch((error) => {
                console.error(error);
                res.json({ success: false, message: "Please try again. Sorry for the inconvenience" });
            });


    }
    catch (err) {
        return res.json({ success: false, message: "Link expired" })
    }
}

const otpSend = (req, res) => {
    const { email } = req.body;
    // if account with email already exists
    User.findOne({ email: req.body.email })
        .then((user) => {
            if (user) {
                let otpcode = Math.floor((Math.random() * 10000) + 1);

                //otp expire

                const expirationTime = new Date();
                expirationTime.setMinutes(expirationTime.getMinutes() + 5);

                Otp.findOneAndUpdate(
                    { email: req.body.email },
                    { code: otpcode ,expirationTime },
                    { upsert: true, new: true }
                )
                    .then((otpData) => {
                        var transporter = nodemailer.createTransport({
                            service: 'gmail',
                            auth: {
                                user: process.env.EMAIL,
                                pass: process.env.PASSWORD
                            }
                        });

                        var mailOptions = {
                            from: process.env.EMAIL,
                            to: user.email,
                            subject: 'Forget Todo Password',
                            html: `<h3> hey! ${user.name},\n </h3><p> Froget Your Todo Password \n</p>
                        <h3> ${otpData.code}</h3>`
                        };
                        transporter.sendMail(mailOptions, function (error, info) {
                            if (error) {

                                return res.json({ success: false, message: "error occured" + error.message });
                            } else {
                                return res.json({ success: true, message: "Code send your Email" })
                            }
                        })
                    })
                    .catch((error) => {
                        res.status(500).json({ success: false, message: "Failed to save OTP to the database", error: error.message });
                    });
            } else {
                res.status(400).json({ success: false, message: "Email not exist" });
            }
        })
        .catch((error) => {
            res.status(500).json({ success: false, message: "Error checking email existence", error: error.message });
        });
};




const changePassword = (req, res) => {
    const { email, otpcode, password } = req.body;

    Otp.findOne({ email, code: otpcode })
        .then((otpData) => {
            if (otpData && otpData.code == otpcode) {
                const currentDateTime = new Date();
                if (otpData.expirationTime > currentDateTime) {
                    // Find user by email
                    User.findOne({ email })
                        .then((user) => {
                            if (user) {
                                // Hash the new password
                                bcrypt.hash(password, 10, (err, hash) => {
                                    if (err) {
                                        return res.json({ success: false, message: err.message });
                                    }

                                    // Update the password
                                    user.password = hash;

                                    // Save the user
                                    user.save()
                                        .then(() => {
                                            res.status(200).json({ success: true, message: "Password changed successfully" });
                                        })
                                        .catch((saveError) => {
                                            res.status(500).json({ success: false, message: "Failed to save user", error: saveError.message });
                                        });
                                });
                            } else {
                                res.status(400).json({ success: false, message: "User not found" });
                            }
                        })
                        .catch((userError) => {
                            res.status(500).json({ success: false, message: "Error finding user", error: userError.message });
                        });
                } else {
                    res.status(400).json({ success: false, message: "OTP has expired" });
                }
            } else {
                res.status(400).json({ success: false, message: "Invalid OTP" });
            }
        })
        .catch((error) => {
            res.status(500).json({ success: false, message: "Something went wrong", error: error.message });
        });
};



module.exports = {
    login,
    signup,
    activateAccount,
    changePassword,
    otpSend
}
