import React from 'react'
import { useSelector } from 'react-redux'
import { Link, NavLink, useNavigate } from 'react-router-dom'

export default function Navbar() {
  const { currentUser } = useSelector(state => state.user);
  const navigate = useNavigate();

  return (
    <div className='flex items-center justify-between w-full p-10 px-15 bg-black shadow-xl'>
      <p onClick={() => navigate('/')} className='pl-4 text-2xl font-bold cursor-pointer'>FitGen</p>
      <ul className='flex items-center gap-10 font-semibold text-gray-500 px-5'>
        <NavLink to={'/'}><li>Home</li></NavLink>
        <NavLink to={'/workouts'}><li>Workouts</li></NavLink>
        <NavLink to={'/about'}><li>About</li></NavLink>
        <NavLink to={'/contact'}><li>Contact</li></NavLink>
      </ul>
      {
        currentUser ? (
          <Link to={'/profile'}>
            <img className='rounded-full h-10 w-10 object-cover' src={currentUser.avatar} alt="Profile" />
          </Link>
        ) : (
          <button onClick={() => navigate('/sign-up')} className='bg-white text-black rounded-lg py-3 px-6 font-semibold text-sm shrink-0 hover:opacity-85 hover:scale-105 transition-all duration-300'>Join Now</button>
        )
      }

    </div>
  )
}
