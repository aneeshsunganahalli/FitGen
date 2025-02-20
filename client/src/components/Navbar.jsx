import React, { useEffect, useState } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { signOutStart, signOutSuccess, signOutFailure } from '../redux/user/userSlice';
import { Home, Dumbbell, Apple, History, LogOut, User } from 'lucide-react';

const Navbar = () => {
  const {currentUser} = useSelector(state => state.user)
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    const updateSlider = () => {
      const activeLink = document.querySelector('.nav-links .active li');
      const previousActive = document.querySelector('.nav-links .previous-active li');

      if (activeLink) {
        const navLinks = document.querySelector('.nav-links');
        const direction = previousActive && previousActive.offsetLeft > activeLink.offsetLeft ? 'right' : 'left';

        requestAnimationFrame(() => {
          navLinks.style.setProperty('--slide-direction', direction);
          navLinks.style.setProperty('--slide-width', `${activeLink.offsetWidth}px`);
          navLinks.style.setProperty('--slide-left', `${activeLink.offsetLeft}px`);
        });

        document.querySelectorAll('.nav-links .previous-active').forEach(el => {
          el.classList.remove('previous-active');
        });
        document.querySelector('.nav-links .active')?.classList.add('previous-active');
      }
    };

    updateSlider();
    window.addEventListener('resize', updateSlider);
    return () => window.removeEventListener('resize', updateSlider);
  }, [location.pathname]);

  const logout = async () => {
    try {
      dispatch(signOutStart());
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/auth/logout`, {
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
  };

  const toggleDropdown = () => {
    setDropdownOpen(prev => !prev);
  };

  const navItems = [
    { path: '/', label: 'Home', icon: Home },
    { path: '/workouts', label: 'Workouts', icon: Dumbbell },
    { path: '/diet', label: 'Diet', icon: Apple },
    { path: '/history', label: 'History', icon: History },
  ];

  return (
    <div className="fixed top-0 left-0 right-0 bg-gray-900/95 backdrop-blur-sm border-b border-gray-800/50 shadow-xl z-50 p-4">

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div 
            onClick={() => navigate('/')} 
            className="text-2xl font-bold text-white cursor-pointer hover:text-indigo-400 transition-colors duration-200"
          >
            FitGen
          </div>

          {/* Navigation Links */}
          <nav className=" flex justify-center">
            <ul className="nav-links  flex justify-center items-center space-x-8 text-sm font-medium">
              {navItems.map(({ path, label, icon: Icon }) => (
                <NavLink
                  key={path}
                  to={path}
                  className={({ isActive }) =>
                    `h-full flex items-center px-2 ${
                      isActive ? 'active text-white' : 'text-gray-400 hover:text-white'
                    } transition-colors duration-200`
                  }
                >
                  <li className="flex items-center gap-2">
                    <Icon size={18} />
                    {label}
                  </li>
                </NavLink>
              ))}
            </ul>
          </nav>

          {/* User Menu */}
          {currentUser ? (
            <div className="relative group">
              <div className="flex items-center gap-3 cursor-pointer" onClick={toggleDropdown}>
                <img 
                  src={currentUser.avatar} 
                  alt="Profile" 
                  className="h-10 w-10 rounded-full object-cover ring-3 ring-gray-800 transition-all duration-200"
                />
              </div>
              
              {dropdownOpen && (
                <div className="absolute right-0 w-48 mt-2 origin-top-right">
                  <div className="bg-gray-800 rounded-lg shadow-lg ring-1 ring-gray-700 overflow-hidden">
                    <div className="p-1">
                      <button
                        onClick={() => navigate('/profile')}
                        className="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 rounded-md transition-colors duration-150"
                      >
                        <User size={16} />
                        Profile
                      </button>
                      <button
                        onClick={logout}
                        className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-400 hover:bg-gray-700 rounded-md transition-colors duration-150"
                      >
                        <LogOut size={16} />
                        Logout
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={() => navigate('/sign-up')}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-3xl text-sm font-medium transition-all duration-200 hover:scale-105"
            >
              Join Now
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;