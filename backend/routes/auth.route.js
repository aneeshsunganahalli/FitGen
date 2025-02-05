import express from 'express';
import { google, signin, signup } from '../controllers/auth.controller.js';

const router = express.Router();

router.post("/google", google)
router.post("/signup", signup)
router.post("/signin", signin)

export default router;

