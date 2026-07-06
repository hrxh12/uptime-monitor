//BullMQ se Queue import karo
const {Queue}=require('bullmq');

//apna Redis connection import karo
const connection =require('./connection');

//ek queue (belt) banao jiska naam "checks" hai
//yahi naam worker mein bhi use hoga taaki dono ek hi belt pe ho
const checkQueue=new Queue('checks',{connection});

//export karo taaki scheduler isse use krke jobs daal sake
module.exports=checkQueue;