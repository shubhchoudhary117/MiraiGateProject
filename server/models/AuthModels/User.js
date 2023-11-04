const mongoose=require("mongoose");


const UserSchema=new mongoose.Schema({
    Name:{
        type:String
    },
    Email:{
        type:String
    },
    Password:{
        type:String
    },
    Token:{
        type:String
    }
})

const UserModel=mongoose.model("UserModel",UserSchema);

module.exports=UserModel;