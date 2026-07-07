const express=require('express');
const router=express.Router();
const bcrypt=require('bcryptjs');
const jwt=require('jsonwebtoken');
const User=require('../models/User');

//token banane ka helper,andar sirf user ki id rakhte hai
//expiresIn=7d baar token bekaar, dobara login karna padega

function makeToken(userId){
    return jwt.sign({userId},process.env.JWT_SECRET,{expiresIn:'7d'});
}

//POST sign up
router.post('/signup',async(req,res)=>{
    try{
        const{name,email,password}=req.body;
        //chhota password mana karo — (password||'') isliye ki password aaye hi na to bhi crash na ho
        if((password||'').length<6){
            return res.status(400).json({error:'Password must be at least 6 characters'});
        }
        //email pehle se hai?to mana krdo
        const existing=await User.findOne({email});
        if(existing){
            return res.status(400).json({error:'Email already registered'});
        }
        //password ko hash karo. 10= kitni mehnat (zyada=slow par safe)
        const passwordHash= await bcrypt.hash(password,10);

        const user= await User.create({name,email,passwordHash});

        //signup hote hi token dedo\
        res.status(201).json({
            token:makeToken(user._id),
            user:{ id:user._id,name:user.name,email:user.email }
        });
    }catch(err){
        res.status(400).json({ error: err.message });
    }
})

//POST /auth/login-purana account
router.post('/login',async(req,res)=>{
    try{
        const{email,password}=req.body;
        
        const user=await User.findOne({email});
        if(!user){
            return res.status(401).json({error:'Invalid email or password'});
        }
        const ok=await bcrypt.compare(password,user.passwordHash);
        if(!ok){
            return res.status(401).json({error:'Invalid email or password'});
        }
        res.json({
            token:makeToken(user._id),
            user:{id:user._id,name:user.name,email:user.email}
        });
    }catch(err){
        res.status(500).json({error:err.message});
    }
});

module.exports=router;