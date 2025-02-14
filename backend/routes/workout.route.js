import express from 'express'
import { generateWorkout, getUserWorkouts } from '../controllers/workout.controller.js';
import { verifyToken } from '../utils/verifyUser.js';

const router = express.Router();

router.post('/generate', verifyToken, generateWorkout)
router.get('/user-workouts', verifyToken, getUserWorkouts);

export default router