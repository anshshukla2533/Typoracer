const jwt=require("jsonwebtoken")

const secret=process.env.JWT_SECRET;
module.exports=(req,res,next)=>{
    const token=req.headers.authorization;

    if(!token)return res.send("no token");

    try{
        const decoded=jwt.verify(token.split(" ")[1],secret);
        req.user=decoded;
        next();
    }catch{
        res.send("Invalid token");
    }
}