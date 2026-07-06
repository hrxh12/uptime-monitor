//.env load kro
require('dotenv').config();

const mongoose=require('mongoose');
const Monitor=require('./models/Monitor');
const{runCheck}=require('./services/checker');

//ye func ek baar mein saare Monitors check karta hai
async function checkAllMonitors(){
    //databases se saare monitors uthao jo pause Nahi hai.
    //{isPaused:False}=sirf woh jinka isPaused false hai
    const monitors=await Monitor.find({isPaused:false});
    console.log(`\nChecking ${monitors.length}monitors...`);

    for(const monitor of monitors){
        const result=await runCheck(monitor);
        console.log(`${monitor.name}:${result.isUp?'UP':'DOWN'} (${result.responseMs}ms)`);
    }
}

async function main(){
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Scheduler connected to to DB');
    //quick check 
    await checkAllMonitors();

    setInterval(checkAllMonitors,30000);
}

main();