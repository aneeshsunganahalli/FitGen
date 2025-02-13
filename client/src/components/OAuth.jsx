import React from 'react'
import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { app } from '../firebase';
import { useDispatch } from 'react-redux';
import { signInSuccess } from '../redux/user/userSlice.js';
import { useNavigate } from 'react-router-dom';

export default function OAuth() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleGoogleClick = async () => {
    try {
      const provider = new GoogleAuthProvider()
      const auth = getAuth(app);

      const result = await signInWithPopup(auth, provider);

      const res = await fetch('http://localhost:5000/api/auth/google', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({
          name: result.user.displayName,
          email: result.user.email,
          photo: result.user.photoURL
        })
      })

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      const data = await res.json();
      dispatch(signInSuccess(data));
      navigate('/');
    } catch (error) {
      console.error("Could not sign in with Google", error);
    }
  }

  return (
    <>
      <button onClick={handleGoogleClick} type='button' className="mt-3 w-full flex items-center justify-center gap-3 bg-black text-white px-6 py-3 rounded-3xl shadow-md hover:bg-gray-900 transition">
        <img src="google-color.svg" className="w-5 h-5" alt="Google Logo"/>
          Continue with Google
      </button>
    </>

  )
}

