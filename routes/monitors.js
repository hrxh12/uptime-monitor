const express=require('express');
const router=express.Router();
const Monitor=require('../models/Monitor');
const {getUptime}=require('../services/uptime');
const Check = require('../models/check');
const Incident = require('../models/Incident');

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

router.get('/:id/uptime',async(req,res)=>{
    try{
        const monitorId=req.params.id;//URL se id nikaalo
        //teeno windows ka uptime nikaalo
        const uptime24h=await getUptime(monitorId,24);
        const uptime7d=await getUptime(monitorId,24*7);
        const uptime30d=await getUptime(monitorId,24*30)

        res.json({uptime24h,uptime7d,uptime30d});
    }catch(err){
        res.status(500).json({error:err.message})
    }
});

module.exports=router;
