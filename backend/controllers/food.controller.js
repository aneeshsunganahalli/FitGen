import axios from 'axios';

const USDA_BASE_URL = "https://api.nal.usda.gov/fdc/v1/foods/search";
const USDA_API_KEY = process.env.USDA_API_KEY;

export const searchFood = async (req, res) => {
  try {
    const { q: query } = req.query;
    
    if (!query) {
      return res.status(400).json({ message: "Query parameter is required" });
    }
    
    const response = await axios.get(USDA_BASE_URL, {
      params: {
        query,
        api_key: USDA_API_KEY,
      },
    });
    
    res.json(response.data);
  } catch (error) {
    console.error("Error fetching food data:", error);
    res.status(500).json({ message: "Failed to fetch food data" });
  }
};