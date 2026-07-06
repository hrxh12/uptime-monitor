// .env load karo(REDIS_URL CHAHIYE
require('dotenv').config();

//ioredis import karo-yeh redis se conncect krne ka tool hai
const Redis=require('ioredis');
//making connection with redis URL 
const redis= new Redis(process.env.REDIS_URL);

redis.on('connect',()=>{
    console.log('Connected to Redis');
});

redis.on('error',(err)=>{
    console.log("Not Connected to Redis");
});

//ek chota sa funtion redis mein ek value likho phir wapas padho
async function test(){

    //"set" = Redis mein ek cheez rakho. yahan "mykey" ka value "hello world"
    await redis.set('mykey','hello world');

    //"get"=us cheez ko wapas padho
    const value=await redis.get('mykey');

    console.log('Value from Redis:',value);
    //connection band krke program khatam karo
    redis.quit();
}

test();