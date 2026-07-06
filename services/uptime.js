const Check=require('../models/check');

async function getUptime(monitorId,hours){

    const since=new Date(Date.now()-hours*60*60*1000);

    const total=await Check.countDocuments({
        monitorId:monitorId,
        checkedAt:{$gte:since}
    });

    if(total===0)
        return null;

    const up=await Check.countDocuments({
        monitorId:monitorId,
        isUp:true,
        checkedAt:{$gte:since}
    });
    
    const percentage = (up / total) * 100;

    return Math.round(percentage*100)/100;
}

module.exports={getUptime};