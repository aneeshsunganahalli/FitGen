import React from 'react';

const CalorieProgress = ({ currentCalories, dailyGoal = 2000 }) => {
  // Calculate percentages and values
  const percentage = Math.min((currentCalories / dailyGoal) * 100, 100);
  const remaining = Math.max(dailyGoal - currentCalories, 0);
  
  // SVG calculations
  const radius = 90;
  const circumference = 2 * Math.PI * radius;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  // Determine color based on percentage
  const getColor = () => {
    if (percentage <= 50) return '#22c55e'; // green-500
    if (percentage <= 75) return '#eab308'; // yellow-500
    if (percentage <= 90) return '#f97316'; // orange-500
    return '#ef4444'; // red-500
  };

  return (
    <div className="relative w-72 h-72 flex items-center justify-center">
      {/* Background circle */}
      <svg className="w-full h-full -rotate-90" viewBox="0 0 200 200">
        <circle
          cx="100"
          cy="100"
          r={radius}
          fill="none"
          stroke="rgba(255, 255, 255, 0.1)"
          strokeWidth="12"
        />
        {/* Progress circle */}
        <circle
          cx="100"
          cy="100"
          r={radius}
          fill="none"
          stroke={getColor()}
          strokeWidth="12"
          strokeDasharray={strokeDasharray}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className="transition-all duration-700 ease-out"
        />
      </svg>
      
      {/* Central content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
        <p className="text-5xl font-bold mb-2">
          {currentCalories}
        </p>
        <p className="text-gray-400 text-sm">
          of {dailyGoal} cal
        </p>
        <p className="mt-4 text-sm font-medium">
          {remaining} cal remaining
        </p>
      </div>
    </div>
  );
};

// Update CalorieTracker to accept currentCalories as a prop
const CalorieTracker = ({ currentCalories }) => {
  return (
    <div className="bg-gray-900 p-8 rounded-xl">
      <CalorieProgress currentCalories={currentCalories} dailyGoal={2000} />
    </div>
  );
};

export default CalorieTracker;