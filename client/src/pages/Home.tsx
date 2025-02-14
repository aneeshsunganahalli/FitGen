import React from 'react'
import Navbar from '../components/Navbar'
import { useNavigate } from 'react-router-dom'
import About from './About'

export default function Home() {

  const navigate = useNavigate()

  return (
    <>
      <Navbar />
      <div
        className="h-screen flex bg-cover bg-center relative"
        style={{ backgroundImage: "url('Home.png')" }}
      >
        {/* Overlay */}
        <div className="absolute inset-0 bg-opacity-50"></div>

        {/* Page */}
        <div className="relative z-10  w-full ">
          <div className='w-128 ml-30'>

            <p className='text-7xl font-semibold mt-50 mb-10'>Elevate your <br />workout</p>

            <p className=''>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt </p>

            <div className=''>
              <button onClick={() => navigate('/sign-up')} className='bg-white text-black text-sm font-semibold py-3 px-6 rounded-lg mt-15 hover:opacity-85 hover:scale-105 transition-all duration-300'>Get started</button>

              <div className='flex gap-5 mt-8'>
                <img src="Twitter 1.png" alt="" />
                <img src="Instagram.png" alt="" />
                <img src="Facebook 1.png" alt="" />
              </div>
            </div>

          </div>
        </div>
      </div>
      <About />
    </>
  )
}
