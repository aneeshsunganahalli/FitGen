import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Dumbbell, Calendar, Activity, Package } from 'lucide-react';
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

  const capitalizeWords = (str) => {
    return str.replace(/\b\w/g, char => char.toUpperCase());
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black mt-30">
          <div className="container mx-auto px-4 py-8">
            <div className="flex items-center justify-center h-64">
              <div className="animate-pulse flex flex-col items-center">
                <Dumbbell size={48} className="text-gray-500 mb-4 animate-bounce" />
                <p className="text-gray-400 text-xl">Loading your workouts...</p>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black mt-30">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-4xl font-bold text-white tracking-tight">
              Workout History
            </h1>
            <div className="bg-indigo-600 text-white px-4 py-2 rounded-lg shadow-lg">
              {workouts.length} Total Workouts
            </div>
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500 text-red-400 px-4 py-3 rounded-lg mb-6">
              <p className="font-medium">Error: {error}</p>
            </div>
          )}

          <div className="grid gap-6">
            {workouts.map((workout) => (
              <div
                key={workout._id}
                className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-xl border border-gray-700/50 shadow-xl hover:shadow-indigo-500/10 transition-all duration-300"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <div className="bg-indigo-600 p-2 rounded-lg">
                      <Activity size={24} className="text-white" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-white mb-1">{workout.goal}</h2>
                      <div className="flex items-center gap-2 text-gray-400">
                        <Calendar size={16} />
                        <span>
                          {new Date(workout.date).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="bg-gray-900/50 p-3 rounded-lg">
                    <div className="flex items-center gap-2 text-gray-400 mb-1">
                      <Activity size={16} />
                      <span className="text-sm">Level</span>
                    </div>
                    <p className="text-white font-medium">{workout.fitnessLevel}</p>
                  </div>
                  <div className="bg-gray-900/50 p-3 rounded-lg">
                    <div className="flex items-center gap-2 text-gray-400 mb-1">
                      <Package size={16} />
                      <span className="text-sm">Equipment</span>
                    </div>
                    <p className="text-white font-medium">{workout.availableEquipment}</p>
                  </div>
                </div>

                <div className="mt-4">
                  <h3 className="text-lg font-semibold text-white mb-3">Exercises</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {workout.exercises.map((exercise, index) => (
                      <div
                        key={index}
                        className="relative group"
                      >
                        <div
                          className={`
                            p-3 rounded-lg text-sm transition-all duration-200
                            ${hoveredExercise === `${workout._id}-${index}`
                              ? 'bg-indigo-600 text-white'
                              : 'bg-gray-900/50 text-gray-300'}
                          `}
                          onMouseEnter={() => setHoveredExercise(`${workout._id}-${index}`)}
                          onMouseLeave={() => setHoveredExercise(null)}
                        >
                          <div className="flex items-center gap-2">
                            <Dumbbell size={16} />
                            <span>{exercise.name}</span>
                          </div>
                          
                          <div
                            className={`
                              absolute z-20 left-0 w-full transform
                              bg-gray-800 text-white border border-gray-700 rounded-lg p-3 shadow-xl
                              transition-all duration-200
                              top-full mt-2
                              ${hoveredExercise === `${workout._id}-${index}`
                                ? 'opacity-100 visible translate-y-0'
                                : 'opacity-0 invisible -translate-y-2'}
                            `}
                          >
                            <p className="flex items-center gap-2 mb-1">
                              <span className="text-gray-400">Sets:</span> {exercise.sets}
                            </p>
                            {exercise.reps !== 0 && (
                              <p className="flex items-center gap-2 mb-1">
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
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {workouts.length === 0 && !error && (
            <div className="flex flex-col items-center justify-center h-64 bg-gray-800/50 rounded-xl border border-gray-700/50">
              <Dumbbell size={48} className="text-gray-500 mb-4" />
              <p className="text-gray-400 text-xl">No workout history found</p>
              <p className="text-gray-500 mt-2">Time to start your fitness journey!</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}