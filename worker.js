require('dotenv').config();

const { processResult } = require('./services/alerting');

const mongoose=require('mongoose');

const{Worker}=require('bullmq');

const connection=require('./queue/connection');

const Monitor=require('./models/Monitor');

const {runCheck}=require('./services/checker');


async function start(){
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Workker connected to DB');
    //worker banao. dhyaan do: naam 'checks'- WAHI jo queue mein tha
    const worker = new Worker('checks',async(job)=>{
            //job.data, jo scheduler bheja tha
            const {monitorId}=job.data;

            //lock lagao
            const lockKey=`lock:${monitorId}`;
            //'NX' = sirf agar nahi hai. 'PX' 30000 = 30 sec baad expire.
            const gotLock=await connection.set(lockKey,'locked','NX','PX',30000);
            
            // agar taala NHI mila (koi aur worker pehle le gaya), to chhod do.
             if (!gotLock) {
                console.log(`Monitor ${monitorId} already locked, skipping`);
                return;   // yahin se bahar — check mat karo
                }

            //us id se data base poora monitor nikaalo

            const monitor= await Monitor.findById(monitorId);
            //if monitor nhi toh chhod do
            if(!monitor){
                console.log(`Monitor ${monitorId} not found, skipping`);
                return;
            }
            const result=await runCheck(monitor);
            await processResult(monitor, result.isUp, result.error);
            console.log(`${monitor.name}: ${result.isUp ? 'UP' : 'DOWN'} — status ${result.statusCode} (${result.responseMs}ms)`);
        },
        {connection} //kaunsi reddis se judna hai
    );

    worker.on('completed',(job)=>{
        console.log(`job${job.id} done`);
    });
    worker.on('failed', (job, err) => {
    console.log(`Job ${job.id} failed:`, err.message);
    });
    console.log('Worker is running,waiting for jobs...');
}

start();