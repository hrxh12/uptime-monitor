require('dotenv').config();

const mongoose=require('mongoose');
const Monitor=require('./models/Monitor');

//apni queue (belt)import karo -isme jobs dalengai
const checkQueue=require('./queue/checkQueue');

//har monitor ko USKE APNE intervalSeconds ke hisaab se job do
//(pehle sab har 30s check hote the — form ka interval field bekaar tha)
async function enqueueChecks(){
    const now=Date.now();
    const monitors=await Monitor.find({isPaused: false});

    for(const monitor of monitors){
        //aakhri baar kab enqueue hua tha? (kabhi nahi = 0, matlab turant due)
        const last=monitor.lastEnqueuedAt ? monitor.lastEnqueuedAt.getTime() : 0;

        //is monitor ka apna interval, milliseconds mein
        const dueMs=monitor.intervalSeconds*1000;

        //abhi iska time nahi hua — agle monitor par jao
        if(now-last<dueMs) continue;

        //queue.add(jobName,jobData)
        //hum sirf monitorID bhej re hai-worker isse monitor dhund lega
        await checkQueue.add('check',{monitorId:monitor._id.toString()});
        console.log(`job added for:${monitor.name} (every ${monitor.intervalSeconds}s)`);

        //time DB mein note karo (memory mein nahi) — scheduler restart par bhi
        //yaad rahe, aur kal ko do scheduler chalao to dono ko dikhe
        await Monitor.updateOne(
            {_id:monitor._id},
            {lastEnqueuedAt:new Date(now)}
        );
    }
}

async function main() {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Scheduler connected to DB');

    await enqueueChecks();

    //tick har 10 second — yeh sirf "kaun due hai?" DEKHNE ki frequency hai,
    //har monitor apne intervalSeconds par hi chalega
    setInterval(enqueueChecks,10000);
}

main();