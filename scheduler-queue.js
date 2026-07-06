require('dotenv').config();

const mongoose=require('mongoose');
const Monitor=require('./models/Monitor');

//apni queue (belt)import karo -isme jobs dalengai
const checkQueue=require('./queue/checkQueue');

//saare monitor k liye ek ek job nelt pe daalta
async function enqueueChecks(){
    const monitors=await Monitor.find({isPaused: false});
    console.log(`\nEnqueuing ${monitors.length} check jobs...`);
    for(const monitor of monitors){
        //queue.add(jobName,jobData)
        //'check'=job ka naam.{monitorId}=job ka data
        //hum sirf monitorID bhej re hai-worker isse monitor dhund lega
        await checkQueue.add('check',{monitorId:monitor._id.toString()});
        console.log(`job added for:${monitor.name}`);
    }
}

async function main() {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Scheduler connected to DB');

    await enqueueChecks();

    //phir har 30 second mein dobara jobs daalo
    setInterval(enqueueChecks,30000);
}

main();