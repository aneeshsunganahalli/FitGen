import React from 'react'
import { useRef, useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import Navbar from '../components/Navbar'

export default function Profile() {

  const { currentUser } = useSelector(state => state.user)
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(updateUserStart());
      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
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

  return (
    <>
      <Navbar />
      <div className='max-w-3xl mx-auto'>
        <h1 className='text-3xl font-semibold text-center my-7'>Profile</h1>
        <form onSubmit={handleSubmit} className=' flex flex-col gap-5 bg-white text-black rounded-lg px-8 py-4'>
          <div>
            <input onChange={(e) => setFile(e.target.files[0])} type='file' ref={fileRef} hidden accept='image/*' />
            <img
              onClick={() => fileRef.current.click()}
              src={formData.avatar || currentUser.avatar}
              alt="Profile"
              className='rounded-full h-24 w-24 object-cover self-center cursor-pointer mt-2'
            />
            <p className='self-center text-sm'>
              {fileUploadError ? (<span className='text-red-700'>Error Image Upload (Image must be less than 2MB)</span>)
                :
                filePerc > 0 && filePerc < 100 ?
                  (<span className='text-slate-700'>{`Uploading ${filePerc}%`}</span>)
                  :
                  filePerc === 100 ?
                    (<span className='text-green-700'>Image Successfully Uploaded</span>)
                    : (
                      ''
                    )
              }
            </p>
          </div>
          <div>
            <input
              type='text'
              placeholder='Username'
              className='border p-3 rounded-lg'
              id='username'
              defaultValue={currentUser.username}

            />

            <input
              type='email'
              placeholder='Email'
              className='border p-3 rounded-lg'
              id='email'
              defaultValue={currentUser.email}

            />

            <input
              type='password'
              placeholder='Password'
              className='border p-3 rounded-lg'
              id='password'
            //onChange={handleChange} 
            />
          </div>

        </form>
      </div>
    </>
  )
}
