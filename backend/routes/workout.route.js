import express from 'express'
import { generateWorkout } from '../controllers/workout.controller.js';
import { verifyToken } from '../utils/verifyUser.js';

const router = express.Router();

router.post('/generate', verifyToken, generateWorkout)

export default router