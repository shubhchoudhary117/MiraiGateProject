const UserModel = require("../../models/AuthModels/User");

class UserController {

    static getUser = async (req, res) => {
        // get ths token user
        let UserId = req.userId;
        try {
            let User = await UserModel.findOne({ _id: UserId });
            if (User) {
                return res.json({ authorization: true, user: User, somethingwrong: false })
            } else {
                return res.json({ authorization: false, user: null, somethingwrong: false })
            }
        } catch (error) {
            console.log(error)
            return res.json({ authorization: false, user: null, somethingwrong: true })
        }
    }




}

module.exports = UserController;