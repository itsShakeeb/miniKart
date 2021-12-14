import express from "express";
import dotenv from 'dotenv';
import connectDB from './config/db.mjs';



dotenv.config()
const app = express()

connectDB()

//Middleware 
app.use(express.json({ extended: true }))

const PORT = process.env.PORT || 5000;

//listening database
app.listen(PORT, () => console.log(`Listening on PORT ${PORT}`))