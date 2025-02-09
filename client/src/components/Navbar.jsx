import React from 'react'

export default function Navbar() {
  return (
    <div className='flex justify-between w-full p-10 px-15 bg-black'>
      <p className='pl-4'>FitGen</p>
      <ul className='flex gap-10'>
        <li>Home</li>
        <li>Workouts</li>
        <li>About</li>
        <li>Contact</li>
      </ul>
      <button>Join Now</button>
    </div>
  )
}
