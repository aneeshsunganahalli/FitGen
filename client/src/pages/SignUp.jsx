import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import OAuth from '../components/OAuth'

export default function SignUp() {

  const [formData, setFormData] = useState({})
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true)
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body : JSON.stringify(formData)
      });

      const data = await res.json();
      if (!data.success) {
        setError(data.message)
        setLoading(false)
        return;
      }
      setLoading(false)
      setError(null)
      navigate('/sign-in')
    } catch (error) {
      setLoading(false)
      setError(error.message)
    }
  }

  return (
    <div
      className="h-screen flex items-center justify-center bg-cover bg-center relative"
      style={{ backgroundImage: "url('p.jpg')" }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-opacity-50"></div>

      {/* Login Form */}
      <div className="relative z-10 p-8 bg-white/30 rounded-xl shadow-lg w-110">
        <h2 className="text-4xl font-bold text-center mb-6 text-black">Join Us</h2>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-black">Name</label>
            <input
              type="text"
              className="w-full px-4 py-3 border rounded-2xl border-black outline-none text-black"
              id='username' onChange={handleChange}
            />
          </div>

          <div className="mb-4">
            <label className="block text-black">Email</label>
            <input
              type="email"
              className="w-full px-4 py-3 border border-black rounded-2xl outline-none text-black"
              id='email' onChange={handleChange}
            />
          </div>

          <div className="mb-4">
            <label className="block font-medium text-black">Password</label>
            <input
              type="password"
              className="w-full px-4 py-3 border rounded-2xl border-black outline-none text-black"
              id='password' onChange={handleChange}
            />
          </div>

          <button className="rounded-2xl cursor-pointer w-full bg-black text-white py-3 hover:bg-black/85 transition">
            Register
          </button>

          <OAuth />

          <p className='text-black text-md pt-3 font-medium'>Don't have an account?
            <Link to={'/sign-in'}>
              <span className=' underline cursor-pointer'> Login</span>
            </Link>
          </p>

        </form>
      </div>
    </div>
  )
}
