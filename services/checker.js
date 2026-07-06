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

            validateStatus:()=>true,
              // yeh naya — request ko browser jaisa dikhao taaki site bot samajh ke block na kare
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36'
            }
        });
        statusCode=response.status;

        // agar user ne expectedStatus set kiya hai to bilkul wahi match karo.
        // warna default: koi bhi 2xx ya 3xx (200-399) up maano.
        if (monitor.expectedStatus) {
            isUp = (statusCode === monitor.expectedStatus);
        } else {
            isUp = (statusCode >= 200 && statusCode < 400);
        }
        
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