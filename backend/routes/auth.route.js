import express from 'express';
import { google, signup } from '../controllers/auth.controller.js';

const router = express.Router();

router.post("/google", google)
router.post("/signup", signup)

export default router;

