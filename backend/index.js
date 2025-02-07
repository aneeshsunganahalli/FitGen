import express from "express";
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from "cookie-parser";
import connectDB from "./config/mongodb.js";
import authRouter from './routes/auth.route.js';
import workoutRouter from './routes/workout.route.js';
import path from 'path';

dotenv.config();
connectDB();

const __dirname = path.resolve();
const app = express();

app.use(cors({ origin: "http://localhost:5173", credentials: true }));

app.use(express.json())
app.use(cookieParser())

app.listen(3000, () => {
  console.log("Server is running on port 3000")
})

app.use('/api/auth', authRouter);
app.use('/api/workouts', workoutRouter);

app.use(express.static(path.join(__dirname, '/client/dist')))

app.get('*', (req,res) => {
  res.sendFile(path.join(__dirname,'client', 'dist', 'index.html'))
})