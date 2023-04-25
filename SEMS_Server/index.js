import express from 'express'
import bodyParser from 'body-parser';
import mongoose from 'mongoose'
import dotenv from "dotenv"
import cors from "cors"

import user from "./routers/userRouter.js"
import owner from "./routers/ownerRouter.js"
import rolemenu from "./routers/roleMenuRouter.js"
import Event from "./routers/eventRouter.js"
dotenv.config()
const app= express();
app.use(cors())
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
const port = process.env.PORT || 7349

mongoose.set('strictQuery', false);
mongoose.connect('mongodb://localhost/SEMS')
.then(() => console.log('Connected to MongoDB...'))
.catch(err => console.error('Could not connect to MongoDB... '+err.message));

app.get("/",(req,res)=>{
    res.send("Welcome to HRMS V-2")
}) 

app.use("/api/user",user)
app.use("/api/owner",owner)
app.use("/api/rolemenuaccess",rolemenu)
app.use("/api/event",Event)

app.listen(port,()=>{
    console.log("Server connected to "+ port); 
})