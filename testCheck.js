//.env load karo
require('dotenv').config();

const mongoose=require('mongoose');
const Monitor=require('./models/Monitor');
const{runCheck}=require('./services/checker');

async function main(){
    //database se connect karo
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to DB');

    //database se ek monitor uthao
    const monitor=await Monitor.findOne();
    console.log('Checking',monitor.name,monitor.url);

    //us monitor ka check chalao
    const result=await runCheck(monitor);
    console.log('Result');
    console.log('isUp:',result.isUp);
    console.log('statuscode:',result.statusCode);
    console.log('responseMs:',result.responseMs);
    console.log('error:',result.error);

    await mongoose.disconnect();

}

main();