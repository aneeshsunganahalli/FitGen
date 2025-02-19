import React from 'react'
import { useRef, useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Navbar from '../components/Navbar'
import {  deleteUserSuccess, deleteUserFailure, deleteUserStart, updateUserFailure, updateUserStart, updateUserSuccess } from '../redux/user/userSlice.js';
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage';
import { app } from '../firebase.js';
import { useNavigate } from 'react-router-dom';
import { User, Mail, Lock, Upload, Trash2 } from 'lucide-react';

export default function Profile() {

  const { currentUser,loading, error } = useSelector(state => state.user)
  const dispatch = useDispatch()
  const [formData, setFormData] = useState({});
  const navigate = useNavigate();


  const fileRef = useRef(null);
  const [file, setFile] = useState(undefined);
  const [filePerc, setFilePerc] = useState(0);
  const [fileUploadError, setFileUploadError] = useState(false);

  useEffect(() => {
    if (file) {
      handleFileUpload(file);
    }
  }, [file]);

  useEffect(() => {
    const formElement = document.getElementById('profile-form');
    if (formElement) {
      formElement.scrollIntoView({ behavior: 'smooth' });
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(updateUserStart());
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/user/update/${currentUser._id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (data.success === false) {
        dispatch(updateUserFailure(data.message));
        return;
      }

      dispatch(updateUserSuccess(data));
      
    } catch (error) {
      dispatch(updateUserFailure(error.message));
    }
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  }


  const handleFileUpload = (file) => {
    const storage = getStorage(app);
    const fileName = new Date().getTime() + file.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on('state_changed',
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setFilePerc(Math.round(progress));
      },
      (error) => {
        setFileUploadError(true);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) =>
          setFormData({ ...formData, avatar: downloadURL }));
      }
    )
  }

  const handleDeleteUser = async () => {
    try {
      // Show confirmation dialog
      const confirmed = window.confirm('Are you sure you want to delete your account? This action cannot be undone.');
      if (!confirmed) return;

      dispatch(deleteUserStart());
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/user/delete/${currentUser._id}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      const data = await res.json();
      if (data.success === false) {
        dispatch(deleteUserFailure(data.message));
        return;
      }

      dispatch(deleteUserSuccess());
      navigate('/sign-in');
    } catch (error) {
      dispatch(deleteUserFailure(error.message));
    }
  };

  return (
    
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black pt-32">
      <div className="container max-w-4xl mx-auto px-4">
        <h1 className="text-4xl font-bold text-white tracking-tight text-center mb-8">
          Profile Settings
        </h1>

        <form onSubmit={handleSubmit} className="bg-gray-800/50 backdrop-blur-sm p-8 rounded-xl border border-gray-700/50 shadow-xl mb-8">
          {/* Profile Image Section */}
          <div className="flex flex-col items-center mb-8">
            <div className="relative group">
              <input 
                onChange={(e) => setFile(e.target.files[0])} 
                type="file" 
                ref={fileRef} 
                hidden 
                accept="image/*" 
              />
              <img
                onClick={() => fileRef.current.click()}
                src={formData.avatar || currentUser.avatar}
                alt="Profile"
                className="h-48 w-48 rounded-full object-cover cursor-pointer transition-all duration-300 group-hover:opacity-75"
              />
              <div 
                onClick={() => fileRef.current.click()}
                className="absolute inset-0 flex items-center justify-center rounded-full bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
              >
                <Upload className="text-white" size={24} />
              </div>
            </div>
            
            {fileUploadError && (
              <p className="mt-2 text-red-400 text-sm flex items-center gap-1">
                Error: Image must be less than 2MB
              </p>
            )}
            {filePerc > 0 && filePerc < 100 && (
              <div className="mt-2 w-48 bg-gray-700 rounded-full h-1.5">
                <div 
                  className="bg-indigo-600 h-1.5 rounded-full transition-all duration-300"
                  style={{ width: `${filePerc}%` }}
                />
              </div>
            )}
          </div>

          {/* Form Fields */}
          <div className="space-y-6">
            <div>
              <label className="block text-white font-medium mb-2">Username</label>
              <div className="relative">
                <User className="absolute left-3 top-3 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Username"
                  className="w-full bg-gray-900/50 text-white border border-gray-700 rounded-lg p-3 pl-10 focus:outline-none focus:ring-2 focus:ring-indigo-600"
                  id="username"
                  defaultValue={currentUser.username}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div>
              <label className="block text-white font-medium mb-2">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 text-gray-400" size={20} />
                <input
                  type="email"
                  placeholder="Email"
                  className="w-full bg-gray-900/50 text-white border border-gray-700 rounded-lg p-3 pl-10 focus:outline-none focus:ring-2 focus:ring-indigo-600"
                  id="email"
                  defaultValue={currentUser.email}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div>
              <label className="block text-white font-medium mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 text-gray-400" size={20} />
                <input
                  type="password"
                  placeholder="Password"
                  className="w-full bg-gray-900/50 text-white border border-gray-700 rounded-lg p-3 pl-10 focus:outline-none focus:ring-2 focus:ring-indigo-600"
                  id="password"
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-8 space-y-4">
            <button 
              disabled={loading}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg p-3 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
            >
              {loading ? 'Updating...' : 'Update Profile'}
            </button>
            
            <button 
              onClick={handleDeleteUser}
              type="button"
              className="w-full bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/50 rounded-lg p-3 transition-colors duration-200 font-medium flex items-center justify-center gap-2"
            >
              <Trash2 size={20} />
              Delete Account
            </button>
          </div>

          {error && (
            <div className="mt-6 bg-red-500/10 border border-red-500 text-red-400 px-4 py-3 rounded-lg">
              <p className="font-medium">{error}</p>
            </div>
          )}
        </form>
      </div>
    </div>
    </>
  )
}
