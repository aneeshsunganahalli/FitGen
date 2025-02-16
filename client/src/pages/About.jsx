import React from 'react';
import { Timer, Map, UserCircle } from 'lucide-react';

const Feature = ({ title, description, icon: Icon }) => (
  <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 hover:shadow-indigo-500/10 transition-all duration-300 rounded-lg">
    <div className="p-8 md:p-12">
      <div className="flex items-center gap-3 mb-4">
        <div className="bg-indigo-600 p-2 rounded-lg">
          <Icon size={24} className="text-white" />
        </div>
        <h3 className="text-white font-bold">{title}</h3>
      </div>
      <p className="text-gray-400">{description}</p>
    </div>
  </div>
);

const About = () => {
  const features = [
    {
      icon: Timer,
      title: 'Efficiency',
      description: 'Streamlined appointment scheduling that fits into your busy lifestyle.'
    },
    {
      icon: Map,
      title: 'Convenience',
      description: 'Access to a network of trusted healthcare professionals in your area.'
    },
    {
      icon: UserCircle,
      title: 'Personalization',
      description: 'Tailored recommendations and reminders to help you stay on top of your health.'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black">
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-white tracking-tight">
            ABOUT <span className="font-medium">US</span>
          </h1>
        </div>

        <div className="flex flex-col md:flex-row gap-12 mb-20">
          <div className="md:w-1/2 flex justify-center">
            <div className="relative w-full max-w-[360px]">
              <div className="absolute -inset-1 bg-indigo-600/20 rounded-lg blur-xl"></div>
              <img
                src="/Rectangle30.png"
                alt="FitGen Overview"
                className="relative w-full rounded-lg object-cover"
              />
            </div>
          </div>
          
          <div className="md:w-1/2 space-y-6">
            <p className="text-gray-300">
              Welcome to <span className="text-white font-bold">FitGen</span>, your ultimate 
              fitness companion for achieving your health and wellness goals. At 
              FitGen, we understand the challenges individuals face when it comes 
              to planning effective workouts and tracking their fitness progress.
            </p>
            
            <p className="text-gray-300">
              FitGen is committed to excellence in fitness technology. We 
              continuously enhance our platform, integrating the latest innovations 
              to improve user experience and provide personalized workout plans 
              tailored to your needs. Whether you're starting your fitness journey 
              or refining your training regimen, FitGen is here to support you 
              every step of the way.
            </p>
            
            <div className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-lg border border-gray-700/50">
              <h2 className="text-xl font-bold text-white mb-4">Our Vision</h2>
              <p className="text-gray-300">
                Our vision at FitGen is to create a seamless and personalized 
                fitness experience for every user. We aim to bridge the gap between 
                individuals and expert fitness guidance, making it easier for you 
                to stay active, achieve your goals, and maintain a healthier lifestyle.
              </p>
            </div>
          </div>
        </div>

        <div className="mb-8">
          <h2 className="text-3xl font-bold text-white tracking-tight mb-2">
            WHY <span className="font-medium">CHOOSE US</span>
          </h2>
          <div className="w-20 h-1 bg-indigo-600 rounded-full"></div>
        </div>
        
        <div className="grid md:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <Feature
              key={index}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default About;