const Monitor=require('../models/Monitor');
const Incident = require('../models/Incident');

async function processResult(monitor,isUp,error){
    if (!isUp){
        //check fail hua
        //consecutive fail
        monitor.consecutiveFails=monitor.consecutiveFails+1;

        //3 check ke baad status down hoga, status tab hi change krengai jab confirm ho site down h
        if(
            monitor.consecutiveFails>=monitor.failureThreshold && monitor.status!=='down'
        ){
            monitor.status='down'

            await Incident.create({
                monitorId:monitor._id,
                startedAt:new Date(),
                cause:error|| 'check failed'
            });
            console.log(`Alert:${monitor.name} is DOWN`);
        }
    }else{
        if(monitor.status=='down'){
            //recover hua
            monitor.status='up';

            const incident=await Incident.findOne({
                monitorId:monitor._id,
                resolvedAt:null
            });
            if(incident){
                incident.resolvedAt=new Date();
                //kitni der down raha=resolve time - start time
                incident.durationMs=incident.resolvedAt-incident.startedAt;
                await incident.save();
            }
            console.log(`ALERT:${monitor.name} has RECOVERED`);
        }else{
            monitor.status='up';
        }
        monitor.consecutiveFails=0;
    }
    await monitor.save();
}

module.exports={processResult};