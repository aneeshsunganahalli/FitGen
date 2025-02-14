import { useState } from "react";
import axios from "axios";

export default function CalorieTracker() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [manualEntries, setManualEntries] = useState([]);
  const [calories, setCalories] = useState("");
  const [foodName, setFoodName] = useState("");

  const searchFood = async () => {
    if (!query) return;
    try {
      const response = await axios.get(`/api/food/search?q=${query}`);
      setResults(response.data.foods || []);
    } catch (error) {
      console.error("Error fetching food data", error);
    }
  };

  const addManualEntry = () => {
    if (!foodName || !calories) return;
    setManualEntries([...manualEntries, { foodName, calories }]);
    setFoodName("");
    setCalories("");
  };

  return (
    <div className="p-4 max-w-lg mx-auto">
      <h1 className="text-xl font-bold mb-4">Calorie Tracker</h1>
      
      <div className="mb-4">
        <input 
          type="text" 
          placeholder="Search food" 
          value={query} 
          onChange={(e) => setQuery(e.target.value)}
          className="border p-2 w-full mb-2"
        />
        <button onClick={searchFood} className="bg-blue-500 text-white px-4 py-2 rounded">Search</button>
      </div>

      {results.length > 0 && (
        <ul className="border p-2 mb-4">
          {results.map((food, index) => (
            <li key={index} className="border-b p-2">{food.description} - {food.foodNutrients?.[0]?.value} kcal</li>
          ))}
        </ul>
      )}

      <div className="mb-4">
        <h2 className="font-semibold mb-2">Manual Entry</h2>
        <input 
          type="text" 
          placeholder="Food Name" 
          value={foodName} 
          onChange={(e) => setFoodName(e.target.value)}
          className="border p-2 w-full mb-2"
        />
        <input 
          type="number" 
          placeholder="Calories" 
          value={calories} 
          onChange={(e) => setCalories(e.target.value)}
          className="border p-2 w-full mb-2"
        />
        <button onClick={addManualEntry} className="bg-green-500 text-white px-4 py-2 rounded">Add</button>
      </div>

      {manualEntries.length > 0 && (
        <ul className="border p-2">
          {manualEntries.map((entry, index) => (
            <li key={index} className="border-b p-2">{entry.foodName} - {entry.calories} kcal</li>
          ))}
        </ul>
      )}
    </div>
  );
}
