const express=require("express")
const app=express()
const dotenv=require("dotenv")
const connection = require("./db")
dotenv.config()
app.use(express.json())
const PORT=process.env.PORT||6000
const {authRouter}=require("./routes/auth.routes")
const { userRouter } = require("./routes/user.routes")
const { messageRouter } = require("./routes/message.routes")

app.get("/",(req,res)=>{
      res.send("hello world")
})


app.use("/auth",authRouter)
app.use("/users",userRouter)
app.use("/messages",messageRouter)

app.listen(PORT,async()=>{
     try {
         await connection
         console.log("server is running",`${PORT}`);
     } catch (error) {
             console.log(error)
     } 
})