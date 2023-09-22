import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/connectDB.js";

dotenv.config();
const PORT=process.env.PORT ||4000;
const DB_URL=process.env.DATABASE_URL;
const app=express();

app.use(cors());
app.use(express.json());

connectDB(DB_URL);


app.listen(PORT,()=>{
    console.log(`listen on PORT: ${PORT}`);
})