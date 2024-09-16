const express=require("express")
const UserModel = require("../models/user.model")
const { authentication } = require("../middlewares/auth.middleware")
const userRouter=express.Router()

userRouter.get("/",authentication,async(req,res)=>{
    try {
           const users=await UserModel.find()
           res.json(users)
    } catch (error) {
        res.status(500).json({error:"Error fetching users"})
    }
})

module.exports={
    userRouter
}