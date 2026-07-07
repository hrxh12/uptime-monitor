const express=require('express');
const router=express.Router();
const Monitor=require('../models/Monitor');
const {getUptime}=require('../services/uptime');
const Check = require('../models/check');
const Incident = require('../models/Incident');
const auth = require('../middleware/auth');
router.use(auth);
//POST /monitor to add new monitor
router.post('/',async(req,res)=>{
    try{
        const monitor = await Monitor.create({ ...req.body, userId: req.userId });
        res.status(201).json(monitor);
    } catch(err){
        res.status(400).json({error:err.message});
    }
});

router.get('/',async (req,res) => {
    try{
        const monitors = await Monitor.find({ userId: req.userId }).sort('-createdAt');
        res.json(monitors);
    }catch(err){
        res.status(500).json({
            error:err.message
        });
    }
});

// helper — yeh monitor MERA hai na? (dusre user ki id daal kar data na padh paye koi)
async function ownsMonitor(monitorId, userId) {
    const monitor = await Monitor.findOne({ _id: monitorId, userId });
    return monitor != null;
}

router.get('/:id/uptime',async(req,res)=>{
    try{
        const monitorId=req.params.id;//URL se id nikaalo
        //pehle ownership check — mera monitor nahi to 404
        if (!(await ownsMonitor(monitorId, req.userId))) {
            return res.status(404).json({ error: 'Monitor not found' });
        }
        //teeno windows ka uptime nikaalo
        const uptime24h=await getUptime(monitorId,24);
        const uptime7d=await getUptime(monitorId,24*7);
        const uptime30d=await getUptime(monitorId,24*30)

        res.json({uptime24h,uptime7d,uptime30d});
    }catch(err){
        res.status(500).json({error:err.message})
    }
});

// GET /monitors/:id/checks — response-time history (graph ke liye)
router.get('/:id/checks', async (req, res) => {
  try {
    // pehle ownership check
    if (!(await ownsMonitor(req.params.id, req.userId))) {
      return res.status(404).json({ error: 'Monitor not found' });
    }
    // us monitor ke aakhri 50 checks, naya sabse pehle
    const checks = await Check.find({ monitorId: req.params.id })
      .sort('-checkedAt')
      .limit(50);
    res.json(checks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /monitors/:id — monitor hatao (sirf apna — userId bhi match hona chahiye)
router.delete('/:id', async (req, res) => {
  try {
    // _id AUR userId dono match — dusre user ka monitor koi delete na kar paye
    const monitor = await Monitor.findOneAndDelete({ _id: req.params.id, userId: req.userId });
    if (!monitor) {
      return res.status(404).json({ error: 'Monitor not found' });
    }
    // uska purana data bhi saaf karo — warna bina malik ke checks pade rahenge
    await Check.deleteMany({ monitorId: monitor._id });
    await Incident.deleteMany({ monitorId: monitor._id });
    res.json({ message: 'Monitor deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /monitors/:id/incidents — us monitor ke incidents (timeline ke liye)
router.get('/:id/incidents', async (req, res) => {
  try {
    // pehle ownership check
    if (!(await ownsMonitor(req.params.id, req.userId))) {
      return res.status(404).json({ error: 'Monitor not found' });
    }
    const incidents = await Incident.find({ monitorId: req.params.id })
      .sort('-startedAt')
      .limit(20);
    res.json(incidents);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports=router;
