const express=require("express")
const UserModel = require("../models/user.model")
const authRouter=express.Router()
const bcrypt=require("bcrypt")
const jwt=require("jsonwebtoken")

authRouter.post("/register",async(req,res)=>{
       const {name,email,password,role,phone}=req.body  
       if(!name|| !email|| !password|| !role|| !phone ){
        return res.status(400).json({error:"All fields are required"})
       }      

    try {
            const existingUser = await UserModel.findOne({ email });
            if (existingUser) {
              return res.status(400).json({ error: "User already exists" });
            }

             bcrypt.hash(password,5,async(error,hash)=>{
                  if(error){
                       res.json({error:error.message})
                  }
                  else{
                    const user=new UserModel({name,email,password:hash,role,phone})
                    await user.save()
                    res.status(201).json({message:"User registerd successfully",user})
                  }
             })
       } catch (error) {
          res.json({error:error.message})
       }
})

authRouter.post("/login",async(req,res)=>{
        const {email,password}=req.body
         
        if(!email || !password){
            return res.status(400).json({error:"please fill both fields"})
        }

        try {
              const user=await UserModel.findOne({email})
              if(user){
                  bcrypt.compare(password,user.password,(error,result)=>{
                         if(result){
                               const token=jwt.sign({userId:user._id,user:user.name},"chatapp")
                               res.json({msg:"logged in",token}) 
                         }
                         else{
                              res.json({msg:"wrong credentials"})
                         }
                  })
              }
              else{
                   res.json({msg:"wrong credentials"})
              }
        } catch (error) {
            res.json({error:error.message})
        }
})


module.exports={authRouter}