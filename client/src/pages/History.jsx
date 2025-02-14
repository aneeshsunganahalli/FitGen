import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Navbar from '../components/Navbar';

export default function History() {
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { currentUser } = useSelector(state => state.user);
  const navigate = useNavigate();
  const [hoveredExercise, setHoveredExercise] = useState(null);

  useEffect(() => {
    if (!currentUser) {
      navigate('/sign-in');
      return;
    }

    const fetchWorkouts = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/workouts/user-workouts', {
          credentials: 'include'
        });

        if (!response.ok) {
          throw new Error('Failed to fetch workouts');
        }

        const data = await response.json();
        setWorkouts(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchWorkouts();
  }, [currentUser, navigate]);

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <p className="text-white">Loading...</p>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="container mx-auto px-4 py-8 mt-30">
        <h1 className="text-3xl font-bold mb-6 text-white">Workout History</h1>
        
        {error && (
          <div className="text-red-400 mb-4">
            Error: {error}
          </div>
        )}

        <div className="grid gap-4">
          {workouts.map((workout) => (
            <div 
              key={workout._id} 
              className="bg-[#111010] p-4 rounded-lg border border-gray-800 text-white"
            >
              <div className="flex justify-between items-start mb-2">
                <h2 className="text-xl font-semibold">{workout.goal}</h2>
                <span className="text-sm text-gray-400">
                  {new Date(workout.date).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric'
                  })}
                </span>
              </div>
              
              <div className="text-sm text-gray-300 mb-2">
                <span className="mr-4">Level: {workout.fitnessLevel}</span>
                <span>Equipment: {workout.availableEquipment}</span>
              </div>

              <div className="mt-3">
                <h3 className="font-medium mb-2">Exercises:</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {workout.exercises.map((exercise, index) => (
                    <div 
                      key={index}
                      className={`
                        px-3 py-2 rounded text-sm relative group
                        transition-all duration-200 ease-in-out
                        ${hoveredExercise === `${workout._id}-${index}` 
                          ? 'bg-white text-black' 
                          : 'bg-black text-white'}
                      `}
                      onMouseEnter={() => setHoveredExercise(`${workout._id}-${index}`)}
                      onMouseLeave={() => setHoveredExercise(null)}
                    >
                      {exercise.name}
                      <div 
                        className={`
                          absolute z-20 left-0 w-full transform
                          bg-black text-white border border-gray-800 rounded p-2 shadow-lg
                          transition-all duration-200 ease-in-out
                          top-full mt-2
                          ${hoveredExercise === `${workout._id}-${index}` 
                            ? 'opacity-100 visible translate-y-0' 
                            : 'opacity-0 invisible -translate-y-2'}
                        `}
                      >
                        <p>Sets: {exercise.sets}</p>
                        {exercise.reps !== 0 && <p>Reps: {exercise.reps}</p>}
                        {exercise.duration !== 'N/A' && <p>Duration: {exercise.duration}</p>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {workouts.length === 0 && !error && (
          <p className="text-white text-center">No workout history found.</p>
        )}
      </div>
    </>
  );
}
