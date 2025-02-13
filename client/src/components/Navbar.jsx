import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom'

export default function Navbar() {
  const { currentUser } = useSelector(state => state.user);
  const navigate = useNavigate();
  const location = useLocation();

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

  return (
    <div className='fixed top-0 left-0 right-0 flex items-center justify-between w-full p-10 px-15 bg-black shadow-xl z-50'>
      <p onClick={() => navigate('/')} className='text-2xl font-bold cursor-pointer'>FitGen</p>
      <ul className='nav-links font-semibold text-gray-500 px-5 pr-10'>
        <NavLink to={'/'} className={({isActive}) => isActive ? 'active' : ''}>
          <li>Home</li>
        </NavLink>
        <NavLink to={'/workouts'} className={({isActive}) => isActive ? 'active' : ''}>
          <li>Workouts</li>
        </NavLink>
        <NavLink to={'/about'} className={({isActive}) => isActive ? 'active' : ''}>
          <li>About</li>
        </NavLink>
        <NavLink to={'/contact'} className={({isActive}) => isActive ? 'active' : ''}>
          <li>Contact</li>
        </NavLink>
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
