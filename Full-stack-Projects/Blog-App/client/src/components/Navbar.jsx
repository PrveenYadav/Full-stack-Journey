import React, { useEffect, useState } from 'react'
import { assets } from '../assets/assets'
import {useNavigate} from 'react-router-dom'
import { useAppContext } from '../context/AppContext';
import { Sun, Moon } from "lucide-react";

const Navbar = () => {

  const {navigate, token} = useAppContext();

  const [darkMode, setDarkMode] = useState(() => {
    // load initial value from localStorage (default false)
    return localStorage.getItem("theme") === "dark";
  });

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  return (
    <div className='flex justify-between items-center py-5 sm:mx-20 xl:mx-32'>
      {/* <img onClick={() => navigate('/')} src={assets.logo} alt="logo" className='w-32 sm:w-44 cursor-pointer' /> */}
      <h1 onClick={() => navigate('/')} className='cursor-pointer text-3xl sm:text-4xl dark:text-white font-sans font-semibold'>Blog<span>Jot</span></h1>

      <div className='flex gap-5'>
        <button onClick={() => navigate('/admin')} className='flex items-center gap-2 rounded-full text-sm cursor-pointer bg-primary text-white px-10 py-2.5'>{token ? 'Dashboard' : 'Login'}
            <img src={assets.arrow} alt="arrow" className='w-3' />
        </button>

        {/* Dark mode */}
        <button onClick={() => setDarkMode(!darkMode)} className="p-2 rounded-2xl shadow-md bg-gray-200 dark:bg-gray-800 transition cursor-pointer">
          {darkMode ? (
            <Sun className="h-6 w-6 text-yellow-400" />
          ) : (
            <Moon className="h-6 w-6 text-gray-900" />
          )}
        </button>
      </div>
    </div>
  )
}

export default Navbar