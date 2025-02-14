import express from 'express';
import { google, signin, signOut, signup } from '../controllers/auth.controller.js';

const router = express.Router();

router.post("/google", google)
router.post("/signup", signup)
router.post("/signin", signin)
router.get("/logout", signOut)

export default router;

