import React from 'react'
import {NavLink, useNavigate} from 'react-router-dom'

export default function Navbar() {

  const navigate = useNavigate()

  return (
    <div className='flex items-center justify-between w-full p-10 px-15 bg-black'>
      <p className='pl-4 text-2xl'>FitGen</p>
      <ul className='flex gap-10 font-semibold text-gray-500 px-5'>
        <NavLink to={'/'}><li>Home</li></NavLink>
        <NavLink to={'/workouts'}><li>Workouts</li></NavLink>
        <NavLink to={'/about'}><li>About</li></NavLink>
        <NavLink to={'/contact'}><li>Contact</li></NavLink>
      </ul>
      <button onClick={() => navigate('/sign-up')} className='bg-white text-black rounded-lg py-3 px-6 font-semibold text-sm shrink-0 hover:opacity-85'>Join Now</button>
    </div>
  )
}
