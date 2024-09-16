const express=require("express")
const { authentication } = require("../middlewares/auth.middleware");
const MessageModel = require("../models/messaging.models");
const messageRouter=express.Router()

messageRouter.post("/send",authentication,async(req,res)=>{
       const {text,receiver}=req.body;
       const sender=req.body.userId
       if(!text || !receiver ||!receiver){
        res.status(400).json({error:"Text and receiver are required"})
       }
       try {
            const message=new MessageModel({text,sender,receiver})
            await message.save()
            res.status(201).json(message)
       } catch (error) {
        res.status(500).json({error:"Error sending message"})
       }
})

messageRouter.get("/",authentication,async(req,res)=>{
       const userId=req.body.userId;
        console.log("Fetching messages for sender:", userId);
       try {
              const messages=await MessageModel.find({
                  $or:[{sender:userId},{receiver:userId}]
              })
               console.log("Messages with staticUserId:", messages);
              res.json(messages)
       } catch (error) {
        res.status(500).json({ error: "Error Fetching message" });
       }
})

messageRouter.post("/reply",authentication,async(req,res)=>{
        const {parentmessageId,text}=req.body
        const sender=req.body.userId
        if(!parentmessageId || !text){
                return res.status(400).json({error:"parent message id and reply is required"})
        }
         try {
               const parentMessage=await MessageModel.findById(parentmessageId)
               if(!parentMessage){
                     return res.status(404).json({error:"parent message not found"})
               }
               const reply={
                     text,
                     sender
               }
               parentMessage.replies.push(reply)
               await parentMessage.save()
               res.json({parentMessage,
                     reply})
         } catch (error) {
              res.status(500).json({error:"error to send the reply"})
         }
})






module.exports={
    messageRouter
}