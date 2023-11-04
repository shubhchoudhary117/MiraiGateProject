const UserModel = require("../../models/AuthModels/User");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer")
const jwt = require("jsonwebtoken")
class AuthController {

    // register a user
    static RegisetrUser = async (req, res) => {
        let body = req.body;
        // check email exist or not
        let user = await UserModel.findOne({ Email: body.email });
        if (user) {
            res.json({ emailIsExist: true, signupsuccess: false, somethingwrong: false })
        } else {
            let salt = await bcrypt.genSalt(10);
            let bcryptPassword = await bcrypt.hash(body.password, salt);
            let newUser = new UserModel({ Name: body.name, Email: body.email, Password: bcryptPassword });
            try {
                newUser.save();
                return res.json({ emailIsExist: false, signupsuccess: true, somethingwrong: false })
            } catch (error) {
                console.log(error);
                return res.json({ emailIsExist: false, signupsuccess: false, somethingwrong: true })
            }
        }
    }


    // Authenticate the user login cradintals 
    static UserLogin = async (req, res, next) => {
        console.log(req.body)
        let body = req.body;
        try {
            let user = await UserModel.findOne({ Email: body.email });
            if (user) {
                bcrypt.compare(body.password, user.Password, async (err, data) => {
                    if (data) {
                        // token expiration date
                        let expireDate = new Date();
                        expireDate.setDate(expireDate.getDate() + 7)

                        // generate token
                        let usertoken = jwt.sign({ userId: user._id }, process.env.SECRETE_KEY, { expiresIn: '1d' })

                        // update the user token
                        let UpdatedUser = await UserModel.updateOne({ _id: user._id }, { Token: usertoken });
                        // set the cookie
                        res.cookie("authtoken", usertoken, { httpOnly: false });
                        return res.json({ login: true, user: user, token: usertoken, somethingwrong: false, passwordInvalid: false, emailInvalid: false })

                        // login successfully all cradintal true

                    } else {
                        return res.json({ login: false, user: null, token: "", somethingwrong: false, passwordInvalid: true, emailInvalid: false })
                    }
                })
            } else {
                return res.json({ login: false, user: null, token: "", somethingwrong: false, passwordInvalid: false, emailInvalid: true })
            }
        } catch (error) {
            console.log(error);
            return res.json({ login: false, user: null, token: "", somethingwrong: true, passwordInvalid: false, emailInvalid: false })
        }
    }



    // send email to client for forgot password
    static SendEMail = async (req, res) => {
        try {
            // chcek the user email is exist or not in our database
            let user = await UserModel.findOne({ Email: req.body.email });
            if (user) {
                // create nodemailer transport
                var transporter = nodemailer.createTransport({
                    service: 'gmail',
                    auth: {
                        user: 'shubhamchoudhary8020@gmail.com',
                        pass: 'juhp outl voym vfhl'
                    }
                });
                var mailOptions = {
                    from: 'shubhamchoudhary8020@gmail.com',
                    to: user.Email,
                    subject: 'creat new password',
                    html: `
                    <h1>Miraigate Software Solutions </h1><br></br>
                    <h5>click on given link and create new password <h5>
                    Link</h1>: http://localhost:3000/miraigate/forgot-password/${user._id}</p>`
                };
                transporter.sendMail(mailOptions, function (error, info) {
                    if (error) {
                        console.log(error);
                        return res.json({ emailSent: false, emailInvalid: false, somethingwrong: true })
                    } else {
                        return res.json({ emailSent: true, emailInvalid: false, somethingwrong: false })
                    }
                });
            } else {
                return res.json({ emailSent: false, emailInvalid: true, somethingwrong: false })
            }
        } catch (error) {
            return res.json({ emailSent: false, emailInvalid: false, somethingwrong: true })
        }
    }



    // update the uer password
    static UpdateUserPassword = async (req, res) => {

        try {
            // check the user is present or not
            let existUser = await UserModel.findOne({ _id: req.body.userid });

            if (existUser) {
                // crypt the password
                let salt = await bcrypt.genSalt(10);
                let bcryptPassword = await bcrypt.hash(req.body.password, salt);

                // remove the old token
                res.clearCookie("authtoken", { httpOnly: true, expires: new Date(Date.now()) })

                // generate new  user token
                let newToken = jwt.sign({ userId: existUser._id }, process.env.SECRETE_KEY, { expiresIn: '1d' })

                let updatedUser = await UserModel.updateOne({ _id: existUser._id }, { Password: bcryptPassword, Token: newToken });

                // updated the cookie
                res.cookie("authtoken", newToken, { httpOnly: false });

                // send the response
                res.json({ passwordUpdated: true, somethingwrong: false });
            }
            else {
                res.json({ passwordUpdated: false, somethingwrong: true });
            }
        } catch (error) {
            console.log(error);
            res.json({ passwordUpdated: false, somethingwrong: true });
        }
    }


    // Logout the user
    static LogoutUser = async (req, res) => {
        try {
            // remove the token from cookie
            res.clearCookie("authtoken", { httpOnly: true, expires: new Date(Date.now()) })
            res.json({ logout: true, somethingwrong: false });
        }
        catch (error) {
            consoel.log(error)
            res.json({ logout: false, somethingwrong: true });
        }
    }


}


module.exports = AuthController








