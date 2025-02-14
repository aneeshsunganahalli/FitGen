import React from 'react'
import { useRef, useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Navbar from '../components/Navbar'
import { signOutFailure, signOutSuccess, signOutStart, deleteUserSuccess, deleteUserFailure, deleteUserStart, updateUserFailure, updateUserStart, updateUserSuccess } from '../redux/user/userSlice.js';
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage';
import { app } from '../firebase.js';

export default function Profile() {

  const { currentUser,loading } = useSelector(state => state.user)
  const dispatch = useDispatch()
  const [formData, setFormData] = useState({});


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
      const res = await fetch(`http://localhost:5000/api/user/update/${currentUser._id}`, {
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
      setUpdateSuccess(true);
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

  const handleSignOut = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/auth/out', {
        method: 'GET',
        credentials: 'include',
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(signOutFailure(data.message));
        return;
      }
      dispatch(signOutSuccess());
    } catch (error) {
      dispatch(signOutFailure(error.message));
    }
  };

  return (
    
    <>
      <Navbar />
      <div id="profile-form"  className='max-w-4xl mx-auto pt-32'>
        <h1 className='text-3xl font-semibold text-center my-7'>Profile</h1>
        <form onSubmit={handleSubmit} className=' flex flex-col gap-5 bg-white text-black rounded-4xl px-12 py-6 mb-20'>
          <div className='mt-5 mb-10 mx-auto'>
            <input onChange={(e) => setFile(e.target.files[0])} type='file' ref={fileRef} hidden accept='image/*' />
            <img
              onClick={() => fileRef.current.click()}
              src={formData.avatar || currentUser.avatar}
              alt="Profile"
              className='rounded-full h-48 w-48 object-cover self-center cursor-pointer mt-2 border-1 border-black'
            />
            <p className='self-center text-sm'>
              {fileUploadError ? (<span className='text-red-700'>Error Image Upload (Image must be less than 2MB)</span>)
                :
                filePerc > 0 && filePerc < 100 ?
                  (<span className='text-slate-700'>{`Uploading ${filePerc}%`}</span>)
                  :
                  filePerc === 100 ?
                    (<span className='text-green-700'></span>)
                    : (
                      ''
                    )
              }
            </p>
          </div>

          <div className='flex flex-col gap-5'>
            <div className=''>
              <p className='font-semibold'>Username</p>
              <input
                type='text'
                placeholder='Username'
                className='border p-3 rounded-lg w-full'
                id='username'
                defaultValue={currentUser.username}
                onChange={handleChange}
              />
            </div>


            <div>
              <p className='font-semibold'>Email</p>
              <input
                type='email'
                placeholder='Email'
                className='border p-3 rounded-lg w-full'
                id='email'
                defaultValue={currentUser.email}
                onChange={handleChange}
              />
            </div>

            <div>
              <p className='font-semibold'>Password</p>
              <input
                type='password'
                placeholder='Password'
                className='border p-3 rounded-lg w-full'
                id='password'
                onChange={handleChange}
              />
            </div>
          </div>

          <button disabled={loading} className=' bg-black text-white rounded-3xl p-3 uppercase hover:opacity-90 disabled:opacity-80'>{loading ? 'Loading...' : "Update"}</button>

        </form>
        <button 
          onClick={handleSignOut}
          className='bg-red-700 text-white rounded-lg p-3 uppercase hover:opacity-95'
        >
          Sign Out
        </button>
      </div>
    </>
  )
}
