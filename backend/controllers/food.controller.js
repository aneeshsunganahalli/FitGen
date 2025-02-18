import axios from 'axios';
import FoodLog from '../models/food.model.js';

// Function to search foods from USDA API
export const searchFoods = async (req, res) => {
  if (!req.user) {
    return res.status(401).json({ error: 'Not authenticated' });
  }

  try {
    const { query } = req.query;
    if (!query) {
      return res.status(400).json({ error: 'Search query is required' });
    }

    const response = await axios.get(
      `https://api.nal.usda.gov/fdc/v1/foods/search`,
      {
        params: {
          api_key: process.env.USDA_API_KEY,
          query,
          pageSize: 10,
        }
      }
    );

    const simplifiedFoods = response.data.foods.map((food) => ({
      foodName: food.description,
      calories: food.foodNutrients.find(
        (nutrient) => nutrient.nutrientName === "Energy"
      )?.value || 0,
      servingSize: food.servingSize ? `${food.servingSize}${food.servingSizeUnit}` : 'N/A',
    }));
    
    res.json(simplifiedFoods);
  } catch (error) {
    console.error('Food search error:', error);
    res.status(500).json({
      error: 'Error searching foods',
      details: error.message
    });
  }
};

// Function to manually add food entry
export const addFoodManually = async (req, res) => {
  if (!req.user) {
    return res.status(401).json({ error: 'Not authenticated' });
  }

  try {
    const { foodName, calories, servingSize } = req.body;

    if (!foodName || !calories || !servingSize) {
      return res.status(400).json({
        error: 'Missing required fields',
        details: 'Food name, calories, and serving size are required'
      });
    }

    const newFoodLog = new FoodLog({
      userId: req.user.id,
      foodName,
      calories: Number(calories),
      servingSize,
      date: new Date()
    });

    await newFoodLog.save();
    res.status(201).json(newFoodLog);
  } catch (error) {
    console.error('Manual food entry error:', error);
    res.status(500).json({
      error: 'Error adding food entry',
      details: error.message
    });
  }
};

// Function to get user's food log
export const getUserFoodLog = async (req, res) => {
  if (!req.user) {
    return res.status(401).json({ error: 'Not authenticated' });
  }

  try {
    // Query to fetch food logs for the authenticated user
    const foodLogs = await FoodLog.find({ userId: req.user.id }).sort({ date: -1 }).select('foodName calories servingSize date');

    // Calculate total calories from the fetched logs
    const totalCalories = foodLogs.reduce((sum, log) => sum + log.calories, 0);

    res.json({
      logs: foodLogs,
      totalCalories
    });
  } catch (error) {
    console.error('Food log retrieval error:', error);
    res.status(500).json({
      error: 'Error retrieving food log',
      details: error.message
    });
  }
};

// New function to get total calories for the current day
export const getDailyCalories = async (req, res) => {
  if (!req.user) {
    return res.status(401).json({ error: 'Not authenticated' });
  }

  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Set to start of the day
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1); // Set to start of the next day

    // Query to fetch food logs for the authenticated user for today
    const foodLogs = await FoodLog.find({
      userId: req.user.id,
      date: { $gte: today, $lt: tomorrow }
    }).select('calories');

    // Calculate total calories from the fetched logs
    const totalCalories = foodLogs.reduce((sum, log) => sum + log.calories, 0);

    res.json({ totalCalories });
  } catch (error) {
    console.error('Daily calories retrieval error:', error);
    res.status(500).json({
      error: 'Error retrieving daily calories',
      details: error.message
    });
  }
};