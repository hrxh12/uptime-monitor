const express=require('express');
const router=express.Router();
const Monitor=require('../models/Monitor');

//POST /monitor to add new monitor
router.post('/',async(req,res)=>{
    try{
        const monitor= await Monitor.create(req.body);
        res.status(201).json(monitor);
    } catch(err){
        res.status(400).json({error:err.message});
    }
});

router.get('/',async (req,res) => {
    try{
        const monitors = await Monitor.find().sort('-createdAt');
        res.json(monitors);
    }catch(err){
        res.status(500).json({
            error:err.message
        });
    }
});

module.exports=router;