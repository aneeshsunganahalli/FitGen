import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';

const Calories = () => {
  const { currentUser } = useSelector(state => state.user);
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [foods, setFoods] = useState([]);
  const [foodLogs, setFoodLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [manualFood, setManualFood] = useState({ foodName: '', calories: '', servingSize: '' });

  useEffect(() => {
    if (!currentUser) {
      navigate('/sign-in');
    } else {
      fetchFoodLogs();
    }
  }, [currentUser, navigate]);

  const fetchFoodLogs = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/food/log`, {
        credentials: 'include',
      });

      if (response.ok) {
        const data = await response.json();
        setFoodLogs(data.logs);
      } else {
        throw new Error(response.statusText);
      }
    } catch (err) {
      console.error('Failed to fetch food logs:', err.message);
      setFoodLogs([]);
    }
  };

  const searchFoods = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`http://localhost:5000/api/food/search?query=${query}`, {
        method: 'GET',
        credentials: 'include',
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch food data');
      }
      
      const data = await response.json();
      setFoods(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const logFood = async (food) => {
    try {
      const response = await fetch('http://localhost:5000/api/food/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          foodName: food.foodName,
          calories: food.calories,
          servingSize: food.servingSize,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to log food');
      }

      await fetchFoodLogs();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleManualLog = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/api/food/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(manualFood),
      });

      if (!response.ok) {
        throw new Error('Failed to log food');
      }

      await fetchFoodLogs();
      setManualFood({ foodName: '', calories: '', servingSize: '' });
    } catch (err) {
      setError(err.message);
    }
  };

  const groupedFoodLogs = foodLogs.reduce((acc, log) => {
    const date = new Date(log.date).toLocaleDateString();
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(log);
    return acc;
  }, {});

  return (
    <>
      <Navbar />
      <div className="container mx-auto px-4 py-8 mt-35">
        <h1 className="text-3xl font-bold mb-6">Calories Tracker</h1>

        {error && <p className="text-red-500 mb-4">{error}</p>}

        <div className="mb-4">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search for food..."
            className="border border-gray-300 rounded p-2 mb-2"
          />
          <button 
            onClick={searchFoods} 
            className="bg-blue-500 text-white rounded p-2 ml-2"
            disabled={loading}
          >
            {loading ? 'Searching...' : 'Search'}
          </button>
        </div>

        <ul className="mt-4">
          {foods.map((food, index) => (
            <li key={`${food.foodName}-${index}`} className="flex justify-between items-center border-b py-2">
              <span>{food.foodName} - {food.calories} calories</span>
              <button onClick={() => logFood(food)} className="bg-green-500 text-white rounded p-1">Log Food</button>
            </li>
          ))}
        </ul>

        <h2 className="text-xl font-semibold mt-4">Manual Food Entry</h2>
        <form onSubmit={handleManualLog} className="mb-4">
          <input
            type="text"
            value={manualFood.foodName}
            onChange={(e) => setManualFood({ ...manualFood, foodName: e.target.value })}
            placeholder="Food Name"
            required
            className="border border-gray-300 rounded p-2 mb-2 mr-2"
          />
          <input
            type="number"
            value={manualFood.calories}
            onChange={(e) => setManualFood({ ...manualFood, calories: e.target.value })}
            placeholder="Calories"
            required
            className="border border-gray-300 rounded p-2 mb-2 mr-2"
          />
          <input
            type="text"
            value={manualFood.servingSize}
            onChange={(e) => setManualFood({ ...manualFood, servingSize: e.target.value })}
            placeholder="Serving Size"
            required
            className="border border-gray-300 rounded p-2 mb-2 mr-2"
          />
          <button type="submit" className="bg-blue-500 text-white rounded p-2">Add Food</button>
        </form>

        <h2 className="text-xl font-semibold mt-4">Logged Foods</h2>
        {Object.keys(groupedFoodLogs).map(date => (
          <div key={date} className="mb-4">
            <h3 className="font-bold">{date}</h3>
            <ul>
              {groupedFoodLogs[date].map(log => (
                <li key={log._id} className="border-b py-2">
                  {log.foodName} - {log.calories} calories
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </>
  );
};

export default Calories;