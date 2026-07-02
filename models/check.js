//Mongo Db se connect krne k liye
const mongoose = require('mongoose');
 
const checkSchema=new mongoose.Schema({
    //ObjectId = Mongo ki unique ID ka type. ref se batate hain ki yeh
    monitorId:{type:mongoose.Schema.Types.ObjectId,ref:'Monitor',required:true},

    statusCode:{type:Number},

    responseMs:{type:Number},

    isUp:{type:Boolean,required:true},

    error:{type:String},

    checkedAt:{type:Date,default:Date.now}

});

module.exports=mongoose.model('Check',checkSchema);