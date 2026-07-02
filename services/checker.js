//req bhejne k liye
const axios=require('axios');
//apna check model import krre 
const Check=require('../models/check');


async function runCheck(monitor){

    const startTime=Date.now();

    let isUp=false;
    let statusCode=null;
    let errorMessage=null;

    try{
        const response=await axios({
            method:monitor.method,
            url:monitor.url,
            timeout:monitor.timeoutMs,

            validateStatus:()=>true
        });
        statusCode=response.status;

        isUp = (statusCode === monitor.expectedStatus);
    }catch(err){
        isUp=false;
        errorMessage=err.message;
    }
    const responseMs=Date.now()-startTime;

      const check = await Check.create({
        monitorId: monitor._id,   // kis monitor ka check hai
        statusCode: statusCode,
        responseMs: responseMs,
        isUp: isUp,
        error: errorMessage
        });
    return check;    
}

module.exports={runCheck};