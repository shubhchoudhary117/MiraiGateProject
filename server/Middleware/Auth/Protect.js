const jsonwebtoken = require("jsonwebtoken");
const UserModel = require("../../models/AuthModels/User.js")

const Protect = async (req, res, next) => {
    let { authtoken } = req.cookies;
    // check token is available or not
    if (authtoken) {
        try {
            // verify the token
            let decoded = jsonwebtoken.verify(authtoken, process.env.SECRETE_KEY);
            if (decoded) {
                // check user cookie token is valid or not
                let tokenUser = await UserModel.findOne({ _id: decoded.userId, Token: authtoken });
                if (tokenUser) {
                    req.userId=tokenUser._id;
                    next();
                } else {
                    // if user tokenUser not valid then send unauthorized response
                    return res.json({badcredintals:true,authorization:false,somethigwrong:false})
                }
            } else {
                // token is invalid send unauthorizaed response
                return res.json({badcredintals:true,authorization:false,somethigwrong:false})
            }
        }
        catch (error) {
            console.log(error);
            return res.json({badcredintals:false,authorization:false,somethigwrong:true})
        }
    } else {
        return res.json({badcredintals:true,authorization:false,somethigwrong:false})
    }

}

module.exports = { Protect }