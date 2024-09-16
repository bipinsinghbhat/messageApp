const jwt=require("jsonwebtoken")
const authentication=(req,res,next)=>{
    const token=req.headers.authorization?.split(" ")[1]
    if(token){
        try {
               const decoded=jwt.verify(token,"chatapp")
               if(decoded){
                console.log("user name and id from token",decoded.userId,decoded.user)
                req.body.userId=decoded.userId
                req.body.user=decoded.user
                next()
               }
               else{
                res.status(403).json({msg:"Not Authorized"})
               }
        } catch (error) {
            res.status(401).json({error:error.message})
        }
    }
    else{
        res.json({msg:"please login"})
    }
}

module.exports={
    authentication
}