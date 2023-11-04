const express=require("express");
const UserController=require("../../Controllers/UserController/UserController.js");
const { Protect } = require("../../Middleware/Auth/Protect.js");
const router=express.Router();


router.get("/user",Protect,UserController.getUser)

// router.get("/setcookie",UserController.setCookie)
// router.get("/getcookie",UserController.getCookie)

module.exports=router;