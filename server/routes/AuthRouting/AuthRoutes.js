const express=require("express");
const AuthController = require("../../Controllers/AuthControllers/AuthController");
const {Protect}=require("../../Middleware/Auth/Protect.js")
const router=express.Router();


router.post("/signup",AuthController.RegisetrUser);
router.post("/login",AuthController.UserLogin)
router.post("/forgot/email",AuthController.SendEMail)
router.get("/logout",AuthController.LogoutUser)
router.post("/change-password",AuthController.UpdateUserPassword)

module.exports=router;