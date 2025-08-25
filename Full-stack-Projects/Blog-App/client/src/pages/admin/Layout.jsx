import React, { useEffect, useState } from 'react'
import { assets } from '../../assets/assets'
import {Outlet} from 'react-router-dom'
import Sidebar from '../../components/admin/Sidebar'
import { useAppContext } from '../../context/AppContext'
import { Sun, Moon } from "lucide-react";

const Layout = () => {

  const {axios, setToken, navigate} = useAppContext();

  const logout = () => {
    localStorage.removeItem('token');
    axios.defaults.headers.common['Authorization'] = null;
    setToken(null)
    navigate('/')
  }

  // Dark mode
  const [darkMode, setDarkMode] = useState(() => {
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
    <>
      <div className='flex items-center justify-between py-2 h-[70px] px-4 sm:px-12 border-b border-gray-200'>
        <img 
          src={assets.logo} 
          alt="" 
          onClick={() => navigate('/')}
          className='w-32 sm:w-40 cursor-pointer' 
        />

        <div className='flex gap-5'>
          <button onClick={logout} className='text-sm px-8 py-2 bg-primary text-white rounded-full cursor-pointer'>Logout</button>
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

      <div className='flex h-[calc(100vh-70px)]'>
        <Sidebar/>
        <Outlet/>
      </div>

    </>
  )
}

export default Layout