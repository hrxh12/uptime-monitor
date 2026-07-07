const mongoose=require('mongoose');

//Monitor ki fields
const monitorSchema=new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId, // dusre document (User) ki id
        ref: 'User'
    },
    name:{
        type:String,
        required:true
    },
    url:{
        type:String,
        required:true
    },
    method:{
        type:String,
        default:'GET'
    },
    intervalSeconds:{
        type:Number,
        default:300
    },
    expectedStatus:{
        type:Number
    },
    timeoutMs:{
        type:Number,
        default:5000
    },
    alertEmail:{
        type:String
    },
    failureThreshold:{
        type:Number,
        default:3
    },
    status:{
        type:String,
        default:'unknown'
    },
    consecutiveFails:{
        type:Number,
        default:0
    },
    isPaused:{
        type:Boolean,
        default:false
    },
    //aakhri baar scheduler ne iska check job kab daala tha
    //default nahi diya — naya monitor turant due hoga (pehla check jaldi mile)
    lastEnqueuedAt:{
        type:Date
    },
    createdAt:{
        type:Date,
        default:Date.now
    }
})

module.exports=mongoose.model('Monitor',monitorSchema);