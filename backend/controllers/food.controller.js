import axios from 'axios';
import FoodLog from '../models/food.model.js';

// Function to search foods from USDA API
export const searchFoods = async (req, res) => {
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
          //dataType: 'Survey (FNDDS)'
        }
      }
    );

    // Extract only the needed information
    const simplifiedFoods = response.data.foods.map((food) => {
      const calories =
        food.foodNutrients.find(
          (nutrient) => nutrient.nutrientName === "Energy"
        )?.value || 0;
    
      // Get serving size value & unit
      let servingSize; // Default if missing
      let servingSizeUnit; // Default to grams
    
      if (food.servingSize) {
        servingSize = food.servingSize // Serving size value
        servingSizeUnit = food.servingSizeUnit
      }
    
    
      return {
        foodName: food.description,
        calories, // Total calories for the food item
        servingSize: `${servingSize}${servingSizeUnit}`,
        
      };
    });
    
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
  try {
    const { foodName, calories, servingSize } = req.body; // Include servingSize

    if (!foodName || !calories || !servingSize) { // Validate all fields except userId
      return res.status(400).json({
        error: 'Missing required fields',
        details: 'Food name, calories, and serving size are required'
      });
    }

    const newFoodLog = new FoodLog({
      userId: req.user._id, // Ensure userId is set
      foodName,
      calories: Number(calories), // Total calories for the food item
      servingSize, // Save serving size
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
  try {
    const { date } = req.query;
    let query = { userId: req.user._id };
    
    console.log('Querying food logs for user:', req.user._id); // Debug log

    // If date is provided, filter by that date
    if (date) {
      const startOfDay = new Date(date);
      startOfDay.setHours(0, 0, 0, 0);
      
      const endOfDay = new Date(date);
      endOfDay.setHours(23, 59, 59, 999);
      
      query.date = {
        $gte: startOfDay,
        $lte: endOfDay
      };

      console.log('Date filter applied:', query.date); // Debug log
    }

    const foodLogs = await FoodLog.find(query)
      .sort({ date: -1 });

    console.log('Retrieved food logs:', foodLogs); // Debug log

    // Calculate total calories
    const totalCalories = foodLogs.reduce(
      (sum, log) => sum + log.calories, 
      0
    );

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
