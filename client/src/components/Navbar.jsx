import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom'
import { signOutStart, signOutSuccess, signOutFailure } from '../redux/user/userSlice'

export default function Navbar() {
  const { currentUser } = useSelector(state => state.user);
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  useEffect(() => {
    const updateSlider = () => {
      const activeLink = document.querySelector('.nav-links .active li');
      const previousActive = document.querySelector('.nav-links .previous-active li');

      if (activeLink) {
        const navLinks = document.querySelector('.nav-links');
        const direction = previousActive && previousActive.offsetLeft > activeLink.offsetLeft ? 'right' : 'left';

        navLinks.style.setProperty('--slide-direction', direction);
        navLinks.style.setProperty('--slide-width', `${activeLink.offsetWidth}px`);
        navLinks.style.setProperty('--slide-left', `${activeLink.offsetLeft}px`);

        // Remove previous-active class from all links
        document.querySelectorAll('.nav-links .previous-active').forEach(el => {
          el.classList.remove('previous-active');
        });

        // Add previous-active class to current active link
        document.querySelector('.nav-links .active').classList.add('previous-active');
      }
    };

    updateSlider();
    window.addEventListener('resize', updateSlider);
    return () => window.removeEventListener('resize', updateSlider);
  }, [location.pathname]);

    const logout = async () => {
      try {
        dispatch(signOutStart());
        const res = await fetch('http://localhost:5000/api/auth/logout', {
          method: 'GET',
          credentials: 'include'
        });
        
        if (res.ok) {
          localStorage.removeItem('access_token');
          dispatch(signOutSuccess());
          navigate('/sign-in');
        } else {
          dispatch(signOutFailure('Logout failed'));
        }
      } catch (error) {
        console.error('Logout failed:', error);
        dispatch(signOutFailure(error.message));
      }
    }

  return (
    <div className='fixed top-0 left-0 right-0 flex items-center justify-between w-full p-10 px-15 bg-black shadow-xl z-50'>
      <p onClick={() => navigate('/')} className='text-2xl font-bold cursor-pointer'>FitGen</p>
      <ul className='nav-links font-semibold text-gray-500 px-5 pr-10'>
        <NavLink to={'/'} className={({ isActive }) => isActive ? 'active' : ''}>
          <li>Home</li>
        </NavLink>
        <NavLink to={'/workouts'} className={({ isActive }) => isActive ? 'active' : ''}>
          <li>Workouts</li>
        </NavLink>
        <NavLink to={'/history'} className={({ isActive }) => isActive ? 'active' : ''}>
          <li>History</li>
        </NavLink>
        <NavLink to={'/about'} className={({ isActive }) => isActive ? 'active' : ''}>
          <li>About</li>
        </NavLink>
      </ul>
      {
        currentUser ? (
          <div className='flex items-center gap-2 cursor-pointer group relative'>
            <img className='rounded-full h-10 w-10 object-cover' src={currentUser.avatar} alt="Profile" />
            <div className='absolute top-0 right-0 pt-14 text-base font-medium text-gray-600 z-20 hidden group-hover:block'>
              <div className='min-w-48 bg-stone-100 flex flex-col rounded gap-4 p-4'>
                <p onClick={() => navigate('/profile')} className='hover:text-black cursor-pointer'>Profile</p>
                <p onClick={logout} className='hover:text-black cursor-pointer'>Logout</p>
              </div>
            </div>
          </div>
        ) : (
          <button onClick={() => navigate('/sign-up')} className='bg-white text-black rounded-lg py-3 px-6 font-semibold text-sm shrink-0 hover:opacity-85 hover:scale-105 transition-all duration-300'>Join Now</button>
        )
      }

    </div>
  )
}
