import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Navbar from '../components/Navbar';
import { Dumbbell, Activity, Package, Sparkles } from 'lucide-react';

export default function Workouts() {
  const { currentUser } = useSelector(state => state.user);
  const navigate = useNavigate();
  const [workoutForm, setWorkoutForm] = useState({
    goal: '',
    fitnessLevel: '',
    availableEquipment: '',
  });
  const [workout, setWorkout] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!currentUser) {
      navigate('/sign-in');
    }
  }, [currentUser, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('http://localhost:5000/api/workouts/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(workoutForm),
        credentials: 'include',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.details || 'Failed to generate workout');
      }

      const data = await response.json();
      setWorkout(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!currentUser) {
    return null;
  }

  return (
    <>
    <Navbar />
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black mt-23">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-bold text-white tracking-tight">
            Generate Workout Plan
          </h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Form Section */}
          <form onSubmit={handleSubmit} className="space-y-6 mb-8">
            <div className="space-y-2">
              <label className="block text-white">Fitness Goal:</label>
              <select
                value={workoutForm.goal}
                onChange={(e) => setWorkoutForm(prev => ({...prev, goal: e.target.value}))}
                className="w-full p-3 border rounded-lg bg-gray-800/50 text-white border-gray-700 backdrop-blur-sm focus:border-indigo-500 transition-all duration-300"
                required
              >
                <option value="">Select a goal</option>
                <option value="Weight Loss">Weight Loss</option>
                <option value="Muscle Gain">Muscle Gain</option>
                <option value="Endurance">Endurance</option>
                <option value="General Fitness">General Fitness</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="block text-white">Fitness Level:</label>
              <select
                value={workoutForm.fitnessLevel}
                onChange={(e) => setWorkoutForm(prev => ({...prev, fitnessLevel: e.target.value}))}
                className="w-full p-3 border rounded-lg bg-gray-800/50 text-white border-gray-700 backdrop-blur-sm focus:border-indigo-500 transition-all duration-300"
                required
              >
                <option value="">Select level</option>
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="block text-white">Available Equipment:</label>
              <input
                type="text"
                value={workoutForm.availableEquipment}
                onChange={(e) => setWorkoutForm(prev => ({...prev, availableEquipment: e.target.value}))}
                className="w-full p-3 border rounded-lg bg-gray-800/50 text-white border-gray-700 backdrop-blur-sm focus:border-indigo-500 transition-all duration-300"
                placeholder="e.g., Dumbbells, Resistance bands, etc."
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 text-white px-4 py-3 rounded-lg font-semibold hover:bg-indigo-500 disabled:bg-gray-600 disabled:text-gray-400 transform hover:scale-102 transition-all duration-300"
            >
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <Dumbbell size={20} className="animate-bounce" />
                  <span>Generating...</span>
                </div>
              ) : (
                'Generate Workout'
              )}
            </button>
          </form>

          {/* AI Integration Section */}
          <div className="bg-gray-800/30 backdrop-blur-sm rounded-xl border border-gray-700/50 p-8 h-fit">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-indigo-600/20 p-3 rounded-lg">
                <Sparkles size={24} className="text-indigo-400" />
              </div>
              <h2 className="text-2xl font-bold text-white">Powered by OpenAI</h2>
            </div>
            
            <div className="space-y-6">
              <p className="text-gray-300 leading-relaxed">
                Our advanced AI system analyzes your goals, fitness level, and available equipment to create 
                personalized workout plans tailored just for you.
              </p>
              
              <div className="relative w-full aspect-video rounded-lg overflow-hidden">
                <img 
                  src='OpenAI_0.webp'
                  alt="AI Workout Generation"
                  className="w-full h-full object-cover rounded-lg"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 to-transparent"></div>
              </div>
            </div>
          </div>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500 text-red-400 px-4 py-3 rounded-lg mb-6">
            <p className="font-medium">Error: {error}</p>
          </div>
        )}

        {workout && (
          <div className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-xl border border-gray-700/50 shadow-xl mt-8">
            <h2 className="text-2xl font-bold text-white mb-6">Your Workout Plan</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-gray-900/50 p-4 rounded-lg">
                <div className="flex items-center gap-2 text-gray-400 mb-1">
                  <Activity size={16} />
                  <span>Goal</span>
                </div>
                <p className="text-white font-medium">{workout.goal}</p>
              </div>
              
              <div className="bg-gray-900/50 p-4 rounded-lg">
                <div className="flex items-center gap-2 text-gray-400 mb-1">
                  <Dumbbell size={16} />
                  <span>Level</span>
                </div>
                <p className="text-white font-medium">{workout.fitnessLevel}</p>
              </div>
              
              <div className="bg-gray-900/50 p-4 rounded-lg">
                <div className="flex items-center gap-2 text-gray-400 mb-1">
                  <Package size={16} />
                  <span>Equipment</span>
                </div>
                <p className="text-white font-medium">{workout.availableEquipment}</p>
              </div>
            </div>
            
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-white">Exercises</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {workout.exercises.map((exercise, index) => (
                  <div
                    key={index}
                    className="bg-gray-900/50 p-4 rounded-lg border border-gray-700/50 hover:border-indigo-500/50 transition-colors duration-300"
                  >
                    <div className="flex items-center gap-2 mb-3">
                      <div className="bg-indigo-600/20 p-2 rounded">
                        <Dumbbell size={20} className="text-indigo-400" />
                      </div>
                      <h4 className="font-bold text-white">{exercise.name}</h4>
                    </div>
                    <div className="space-y-1 text-gray-300">
                      <p className="flex items-center gap-2">
                        <span className="text-gray-400">Sets:</span> {exercise.sets}
                      </p>
                      {exercise.reps !== 0 && (
                        <p className="flex items-center gap-2">
                          <span className="text-gray-400">Reps:</span> {exercise.reps}
                        </p>
                      )}
                      {exercise.duration !== 'N/A' && (
                        <p className="flex items-center gap-2">
                          <span className="text-gray-400">Duration:</span> {exercise.duration}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
    </>
  );
}
