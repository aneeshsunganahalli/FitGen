import express from 'express'
import { generateWorkout } from '../controllers/workout.controller.js';

const router = express.Router();

router.post('/generate', generateWorkout)

export default router