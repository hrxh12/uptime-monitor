const mongoose=require('mongoose');

const incidentSchema=new mongoose.Schema({
    monitorId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Monitor',
        required:true
    },
    startedAt:{
        type:Date,
        default:Date.now,
    },
    resolvedAt:{
        type:Date,
        default:null,
    },
    durationMs:{
        type:Number
    },
    cause:{
        type:String
    }
});

module.exports=mongoose.model('Incident',incidentSchema);