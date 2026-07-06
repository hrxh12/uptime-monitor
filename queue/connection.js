//.env load karo
require('dotenv').config();

const Redis=require('ioredis');

//BullMQ k liye Redis connection
//maxRetriesPerRequest:null --Yeh BullMQ ki zaroorat hai verna warning deta hai

const connection=new Redis(process.env.REDIS_URL,{
    maxRetriesPerRequest:null
});

//export karo taaki queue aur worker dono use kar sakein
module.exports=connection;