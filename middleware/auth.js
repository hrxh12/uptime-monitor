const jwt=require('jsonwebtoken');
//middleware=route se PEHLE chalne waala  function
//token check karo- sahi hai toh aage jaane do
function auth(req,res,next){
    //frontend header bhejta hai
    const header=req.headers.authorization
    //header nahi hai YA "Bearer " se shuru NAHI hota — dono mein bhagao
    if(!header||!header.startsWith('Bearer ')){
        return res.status(401).json({error:'No token, please log in'});
    }

    const token=header.split(' ')[1];//"Bearer k baad waala hissa"

    try{
        //verify=signature check+ expiry check, dono ek saath
        const payload=jwt.verify(token,process.env.JWT_SECRET);
        //user ki id request par chipka do- aage k route use krengai
        req.userId=payload.userId;
        next();
    }catch(err){
        return res.status(401).json({error:'Invalid or expired token'});
    }
}

module.exports=auth;