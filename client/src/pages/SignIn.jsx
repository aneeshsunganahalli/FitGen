import React from 'react'
import { Link } from 'react-router-dom'
import OAuth from '../components/OAuth'

export default function SignIn() {
  return (
    <div
      className="h-screen flex items-center justify-center bg-cover bg-center relative"
      style={{ backgroundImage: "url('p.jpg')" }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-opacity-50"></div>

      {/* Login Form */}
      <div className="relative z-10 p-8 pb-12 bg-white/35 rounded-lg shadow-lg w-110">
        <h2 className="text-4xl font-bold text-center mb-6 text-black">Login</h2>

        <form>
          <div className="mb-4">
            <label className="block text-black">Email</label>
            <input
              type="email"
              className="w-full px-4 py-3 border border-black rounded-2xl outline-none text-black"
            />
          </div>

          <div className="mb-4">
            <label className="block text-black">Password</label>
            <input
              type="password"
              className="w-full px-4 py-3 border rounded-2xl border-black outline-none text-black"
            />
          </div>

          <button className=" cursor-pointer w-full bg-black text-white py-3 rounded-2xl hover:bg-black/85 transition">
            Login
          </button>

          <OAuth />

          <p className='text-black text-md pt-3 font-medium'>Already have an account?
            <Link to={'/sign-up'}>
              <span className=' cursor-pointer'> R</span>
              <span className='underline cursor-pointer'>egiste</span>
              <span className=' cursor-pointer'>r</span>
            </Link>
          </p>

        </form>
      </div>
    </div>
  )
}
