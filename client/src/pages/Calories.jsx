import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { Search, Plus, Apple, Calendar, Clock, Scale } from 'lucide-react';

const Calories = () => {
  const { currentUser } = useSelector(state => state.user);
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [foods, setFoods] = useState([]);
  const [foodLogs, setFoodLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [manualFood, setManualFood] = useState({
    foodName: '',
    calories: '',
    servingSize: '',
  });
  const [servingSizeError, setServingSizeError] = useState('');

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

  const validateServingSize = (size) => {
    const regex = /^\d+g$/;
    return regex.test(size);
  };

  const handleManualLog = async (e) => {
    e.preventDefault();
    if (!validateServingSize(manualFood.servingSize)) {
      setServingSizeError('Serving size must be in the format "xg" (e.g., "150g").');
      return;
    }
    setServingSizeError('');
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

  const capitalizeWords = (str) => {
    return str.replace(/\b\w/g, char => char.toUpperCase());
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
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
        <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black mt-30">
          <div className="container mx-auto px-4 py-8">
            <div className="flex items-center justify-between mb-8">
              <h1 className="text-4xl font-bold text-white tracking-tight">
                Calories Tracker
              </h1>
              <div className="bg-indigo-600 text-white px-4 py-2 rounded-lg shadow-lg">
                Today's Goal: 2000 cal
              </div>
            </div>
  
            {error && (
              <div className="bg-red-500/10 border border-red-500 text-red-400 px-4 py-3 rounded-lg mb-6">
                <p className="font-medium">{error}</p>
              </div>
            )}
  
            {/* Search Section */}
            <div className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-xl border border-gray-700/50 shadow-xl mb-8">
              <div className="flex gap-2">
                <div className="flex-1 relative">
                  <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search for food..."
                    className="w-full bg-gray-900/50 text-white border border-gray-700 rounded-lg p-3 pl-10 focus:outline-none focus:ring-2 focus:ring-indigo-600"
                  />
                  <Search className="absolute left-3 top-3.5 text-gray-400" size={20} />
                </div>
                <button 
                  onClick={searchFoods} 
                  className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg px-6 py-3 transition-colors duration-200"
                  disabled={loading}
                >
                  {loading ? 'Searching...' : 'Search'}
                </button>
              </div>
  
              <ul className="mt-4 space-y-2">
                {foods.map((food, index) => (
                  <li key={`${food.foodName}-${index}`} 
                      className="bg-gray-900/50 rounded-lg p-4 flex justify-between items-center group hover:bg-gray-800/50 transition-colors duration-200">
                    <div className="flex items-center gap-3">
                      <Apple className="text-gray-400" size={20} />
                      <div>
                        <span className="text-white">{capitalizeWords(food.foodName)}</span>
                        <div className="text-sm text-gray-400">
                          {food.calories} calories • {food.servingSize}
                        </div>
                      </div>
                    </div>
                    <button 
                      onClick={() => logFood(food)} 
                      className="bg-green-600 hover:bg-green-700 text-white rounded-lg px-4 py-2 transition-colors duration-200"
                    >
                      Log Food
                    </button>
                  </li>
                ))}
              </ul>
            </div>
  
            {/* Manual Entry Section */}
            <div className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-xl border border-gray-700/50 shadow-xl mb-8">
              <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                <Plus size={20} /> Manual Food Entry
              </h2>
              <form onSubmit={handleManualLog} className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <input
                  type="text"
                  value={manualFood.foodName}
                  onChange={(e) => setManualFood({ ...manualFood, foodName: e.target.value })}
                  placeholder="Food Name"
                  required
                  className="bg-gray-900/50 text-white border border-gray-700 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-indigo-600"
                />
                <input
                  type="number"
                  value={manualFood.calories}
                  onChange={(e) => setManualFood({ ...manualFood, calories: e.target.value })}
                  placeholder="Calories"
                  required
                  className="bg-gray-900/50 text-white border border-gray-700 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-indigo-600"
                />
                <input
                  type="text"
                  value={manualFood.servingSize}
                  onChange={(e) => {
                    setManualFood({ ...manualFood, servingSize: e.target.value });
                    setServingSizeError('');
                  }}
                  placeholder="Serving Size (e.g., 150g)"
                  required
                  className="bg-gray-900/50 text-white border border-gray-700 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-indigo-600"
                />
                {servingSizeError && <p className="text-red-500">{servingSizeError}</p>}
                <button 
                  type="submit" 
                  className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg px-6 py-3 transition-colors duration-200"
                >
                  Add Food
                </button>
              </form>
            </div>
  
            {/* Food Log Section */}
            <div className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-xl border border-gray-700/50 shadow-xl">
              <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                <Clock size={20} /> Food Log History
              </h2>
              <div className="space-y-4">
                {Object.keys(groupedFoodLogs).map(date => (
                  <div key={date} className="bg-gray-900/50 rounded-lg p-4">
                    <h3 className="text-white font-bold flex items-center gap-2 mb-3">
                      <Calendar size={16} className="text-gray-400" />
                      {formatDate(date)}
                    </h3>
                    <ul className="space-y-2">
                      {groupedFoodLogs[date].map(log => (
                        <li key={log._id} className="flex items-center justify-between text-gray-300 py-2 border-b border-gray-700/50 last:border-0">
                          <div className="flex items-center gap-3">
                            <Scale size={16} className="text-gray-400" />
                            <span>{capitalizeWords(log.foodName)}</span>
                          </div>
                          <div className="text-gray-400">
                            {log.calories} calories • {log.servingSize}
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </>
    );
};

export default Calories;