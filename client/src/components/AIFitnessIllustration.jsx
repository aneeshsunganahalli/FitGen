import React from 'react';

const AIFitnessIllustration = () => {
  return (
    <svg viewBox="0 0 600 400" xmlns="http://www.w3.org/2000/svg">
      {/* Background elements */}
      <defs>
        <linearGradient id="gridGradient" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="#4F46E5" stop-opacity="0.1"/>
          <stop offset="100%" stop-color="#4F46E5" stop-opacity="0"/>
        </linearGradient>
        <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
          <path d="M 40 0 L 0 0 0 40" fill="none" stroke="url(#gridGradient)" stroke-width="0.5"/>
        </pattern>
      </defs>
      
      {/* Background with grid */}
      <rect width="600" height="400" fill="#1F2937" opacity="0.5"/>
      <rect width="600" height="400" fill="url(#grid)"/>
      
      {/* Central brain circuit design */}
      <g transform="translate(250, 150)">
        {/* Brain outline */}
        <path d="M0,0 C30,-20 60,-20 90,0 C120,20 150,20 180,0" 
              fill="none" stroke="#6366F1" stroke-width="3" opacity="0.6"/>
        <path d="M0,20 C30,0 60,0 90,20 C120,40 150,40 180,20" 
              fill="none" stroke="#6366F1" stroke-width="3" opacity="0.6"/>
              
        {/* Circuit nodes */}
        <circle cx="0" cy="0" r="5" fill="#6366F1"/>
        <circle cx="60" cy="-10" r="5" fill="#6366F1"/>
        <circle cx="120" cy="10" r="5" fill="#6366F1"/>
        <circle cx="180" cy="0" r="5" fill="#6366F1"/>
        
        {/* Pulse animations */}
        <circle cx="60" cy="-10" r="10" fill="none" stroke="#6366F1" opacity="0.3">
          <animate attributeName="r" values="5;15;5" dur="2s" repeatCount="indefinite"/>
          <animate attributeName="opacity" values="0.6;0;0.6" dur="2s" repeatCount="indefinite"/>
        </circle>
        <circle cx="120" cy="10" r="10" fill="none" stroke="#6366F1" opacity="0.3">
          <animate attributeName="r" values="5;15;5" dur="2s" begin="0.5s" repeatCount="indefinite"/>
          <animate attributeName="opacity" values="0.6;0;0.6" dur="2s" begin="0.5s" repeatCount="indefinite"/>
        </circle>
      </g>
      
      {/* Fitness elements */}
      <g transform="translate(200, 250)">
        {/* Dumbbell */}
        <line x1="0" y1="0" x2="100" y2="0" stroke="#6366F1" stroke-width="4"/>
        <circle cx="0" cy="0" r="15" fill="#4F46E5"/>
        <circle cx="100" cy="0" r="15" fill="#4F46E5"/>
        
        {/* Pulse wave */}
        <path d="M150,0 L170,-20 L190,0 L210,-20 L230,0" 
              fill="none" stroke="#6366F1" stroke-width="3">
          <animate attributeName="stroke-opacity" values="1;0.3;1" dur="2s" repeatCount="indefinite"/>
        </path>
      </g>
      
      {/* Decorative elements */}
      <g transform="translate(0, 0)" opacity="0.1">
        <circle cx="50" cy="50" r="30" fill="#6366F1"/>
        <circle cx="550" cy="350" r="40" fill="#6366F1"/>
      </g>
    </svg>
  );
};

export default AIFitnessIllustration;