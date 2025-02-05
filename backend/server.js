import express from "express";
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from "cookie-parser";
import connectDB from "./config/mongodb.js";

dotenv.config()

connectDB();

const app = express();

app.use(cors())
app.use(express.json())
app.use(cookieParser())

app.listen(3000, () => {
  console.log("Server is running on port 3000")
})