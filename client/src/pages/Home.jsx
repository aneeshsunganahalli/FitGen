import React from 'react'
import Navbar from '../components/Navbar'

export default function Home() {
  return (
    <>
  <Navbar />
    <div
      className="h-screen items-center flex bg-cover bg-center relative"
      style={{ backgroundImage: "url('Home.png')" }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-opacity-50"></div>

      {/* Page */}
      <div className="relative z-10  w-full">
       <div className='w-128 ml-20'>
        <p className='text-7xl'>Elevate your <br />workout</p>
        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt </p>
       </div>
      </div>
    </div>
    </>
  )
}
