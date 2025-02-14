import express from 'express';
import { searchFood } from '../controllers/food.controller.js';
import { verifyToken } from '../utils/verifyUser.js';

const router = express.Router();

router.get("/search",verifyToken, searchFood);

export default router;