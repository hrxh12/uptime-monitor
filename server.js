require('dotenv').config()

const cors = require('cors');
const express= require('express');
const mongoose=require('mongoose');

const app=express();

app.use(cors());
//Middleware lets express understand json
app.use(express.json());

//simple route to check if the server is alive or not
app.get('/health',(req,res)=>{
    res.json({status:'ok', message:'server is running'});
});

//Moonitor se Related saare routes
const monitorRoutes=require('./routes/monitors');
app.use('/monitors',monitorRoutes);

//connect to mongodb then start the sever

const PORT=process.env.PORT|| 4000;

mongoose
    .connect(process.env.MONGO_URI)
    .then(()=>{
        console.log('Connected')
        app.listen(PORT,()=>{
             console.log(`Server running on http://localhost:${PORT}`);
        });
    })
    .catch((err) => {
    console.error('MongoDB connection failed:', err.message);
    });