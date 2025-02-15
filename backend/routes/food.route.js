import express from 'express';
import { verifyToken } from '../utils/verifyUser.js';
import { 
  searchFoods, 
  addFoodManually, 
  getUserFoodLog 
} from '../controllers/food.controller.js';

const router = express.Router();

// Search foods from USDA database
router.get('/search',verifyToken,  searchFoods);

// Add manual food entry
router.post('/add', verifyToken, addFoodManually);

// Get user's food log
router.get('/log', verifyToken, getUserFoodLog);

export default router;
