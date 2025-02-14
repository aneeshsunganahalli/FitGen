import React from 'react'
import Navbar from '../components/Navbar'

export default function About() {
  return (
    <>
      <Navbar />
      <div className='flex flex-col justify-center items-center mt-30'>
      <div className='text-center text-2xl pt-10 text-white'>
        <p>ABOUT <span className='text-white font-medium'>US</span></p>
      </div>

      <div className='ml-40 mr-20 flex flex-col justify-center items-center md:flex-row gap-12'>
        <img className='w-full md:max-w-[360px]' src='Rectangle30.png' alt="" />
        <div className='flex flex-col justify-center gap-6 md:w-2/4 text-sm text-white'>
          <p>Welcome to <span className='font-bold'>FitGen</span>, your ultimate fitness companion for achieving your health and wellness goals. At FitGen, we understand the challenges individuals face when it comes to planning effective workouts and tracking their fitness progress.</p>
          <p>FitGen is committed to excellence in fitness technology. We continuously enhance our platform, integrating the latest innovations to improve user experience and provide personalized workout plans tailored to your needs. Whether you're starting your fitness journey or refining your training regimen, FitGen is here to support you every step of the way.</p>
          <b className='text-white'>Our Vision</b>
          <p>Our vision at FitGen is to create a seamless and personalized fitness experience for every user. We aim to bridge the gap between individuals and expert fitness guidance, making it easier for you to stay active, achieve your goals, and maintain a healthier lifestyle.</p>
        </div>
      </div>

      <div className='text-xl my-4 ml-10 mr-10'>
        <p>WHY <span  className='text-white font-semibold'>CHOOSE US</span></p>
      </div>

      <div className='flex flex-col md:flex-row mb-20 ml-10 mr-10'>

        <div className='border px-10 md:px-16 py-8 sm:py-16 flex flex-col gap-5 text-[15px] hover:bg-white hover:text-black transition-all duration-300 text-gray-600 cursor-pointer'>
          <b>Efficiency:</b>
          <p>Streamlined appointment scheduling that fits into your busy lifestyle.</p>
        </div>

        <div className='border px-10 md:px-16 py-8 sm:py-16 flex flex-col gap-5 text-[15px] hover:bg-white hover:text-black transition-all duration-300 text-gray-600 cursor-pointer'> 
          <b>Convenience:</b>
          <p>Access to a network of trusted healthcare professionals in your area.</p>
        </div>

        <div className='border px-10 md:px-16 py-8 sm:py-16 flex flex-col gap-5 text-[15px] hover:bg-white hover:text-black transition-all duration-300 text-gray-600 cursor-pointer'>
          <b>Personalization:</b>
          <p>Tailored recommendations and reminders to help you stay on top of your health.</p>
        </div>
      </div>

    </div>
    </>
  )
}
