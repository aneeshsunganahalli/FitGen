import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import OAuth from '../components/OAuth'
import { useDispatch, useSelector } from 'react-redux'
import { signInFailure, signInStart, signInSuccess } from '../redux/user/userSlice'

export default function SignIn() {

  const [formData, setFormData] = useState({})
  const { loading, error } = useSelector(state => state.user)

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(signInStart());
      const res = await fetch('/api/auth/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      })
      const data = await res.json()
      if(data.success === false){
        dispatch(signInFailure(data))
        return;
      }
      dispatch(signInSuccess(data))
      navigate('/')
    } catch (error) {
      dispatch(signInFailure(error.message))
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
      <div className="relative z-10 p-8 pb-12 bg-white/35 rounded-lg shadow-lg w-110">
        <h2 className="text-4xl font-bold text-center mb-6 text-black">Login</h2>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-black">Email</label>
            <input
              type="email"
              className="w-full px-4 py-3 border border-black rounded-2xl outline-none text-black"
              id='email' onChange={handleChange}
            />
          </div>

          <div className="mb-4">
            <label className="block text-black">Password</label>
            <input
              type="password"
              className="w-full px-4 py-3 border rounded-2xl border-black outline-none text-black"
              id='password' onChange={handleChange}
            />
          </div>

          <button onClick={handleSubmit} className=" cursor-pointer w-full bg-black text-white py-3 rounded-3xl hover:bg-black/85 transition">
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
