import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Navbar from '../components/Navbar';

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
        credentials: 'include', // This is crucial for sending cookies
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
    return null; // or return a loading spinner
  }

  return (
    <>
      <Navbar />
      <div className="container mx-auto px-4 py-8 mt-30">
        <h1 className="text-3xl font-bold mb-6 text-white">Generate Workout Plan</h1>
        
        <form onSubmit={handleSubmit} className="max-w-md mb-8">
          <div className="mb-4">
            <label className="block mb-2 text-white">Fitness Goal:</label>
            <select
              value={workoutForm.goal}
              onChange={(e) => setWorkoutForm(prev => ({...prev, goal: e.target.value}))}
              className="w-full p-2 border rounded bg-gray-800 text-white border-gray-700"
              required
            >
              <option value="">Select a goal</option>
              <option value="Weight Loss">Weight Loss</option>
              <option value="Muscle Gain">Muscle Gain</option>
              <option value="Endurance">Endurance</option>
              <option value="General Fitness">General Fitness</option>
            </select>
          </div>

          <div className="mb-4">
            <label className="block mb-2 text-white">Fitness Level:</label>
            <select
              value={workoutForm.fitnessLevel}
              onChange={(e) => setWorkoutForm(prev => ({...prev, fitnessLevel: e.target.value}))}
              className="w-full p-2 border rounded bg-gray-800 text-white border-gray-700"
              required
            >
              <option value="">Select level</option>
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
            </select>
          </div>

          <div className="mb-4">
            <label className="block mb-2 text-white">Available Equipment:</label>
            <input
              type="text"
              value={workoutForm.availableEquipment}
              onChange={(e) => setWorkoutForm(prev => ({...prev, availableEquipment: e.target.value}))}
              className="w-full p-2 border rounded bg-gray-800 text-white border-gray-700"
              placeholder="e.g., Dumbbells, Resistance bands, etc."
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="bg-white font-semibold text-black px-4 py-2 rounded hover:bg-gray-200 disabled:bg-gray-600 disabled:text-gray-400"
          >
            {loading ? 'Generating...' : 'Generate Workout'}
          </button>
        </form>

        {error && (
          <div className="text-red-400 mb-4">
            Error: {error}
          </div>
        )}

        {workout && (
          <div className="bg-[#111010] p-6 rounded-lg shadow-md text-white border border-gray-800">
            <h2 className="text-2xl font-bold mb-4">Your Workout Plan</h2>
            <div className="mb-4">
              <p><strong>Goal:</strong> {workout.goal}</p>
              <p><strong>Fitness Level:</strong> {workout.fitnessLevel}</p>
              <p><strong>Equipment:</strong> {workout.availableEquipment}</p>
            </div>
            
            <h3 className="text-xl font-semibold mb-3">Exercises:</h3>
            <div className="grid gap-4">
              {workout.exercises.map((exercise, index) => (
                <div key={index} className="border border-gray-800 p-4 rounded bg-black">
                  <h4 className="font-bold">{exercise.name}</h4>
                  <p>Sets: {exercise.sets}</p>
                  {exercise.reps !== 0 && <p>Reps: {exercise.reps}</p>}
                  {exercise.duration !== 'N/A' && <p>Duration: {exercise.duration}</p>}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
