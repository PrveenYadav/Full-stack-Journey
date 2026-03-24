import React, { useContext, useEffect, useState } from "react"
import { Moon, Sun, User, ShoppingCart, X, XIcon, MenuIcon, UtensilsCrossed } from "lucide-react";
import { CartContext } from "../context/CartContext.js";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from 'framer-motion'
import { HamburgerButton } from "./Hamburger.jsx";
import { AppContext } from "../context/AppContext.jsx";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false); // menubar or hamburger state

  const { cartItems } = useContext(CartContext);
  const navigate = useNavigate()

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

  const toggleDarkMode = () => {
    setDarkMode((prev) => !prev);
    setIsOpen(!isOpen)
  };

  const { userData } = useContext(AppContext)

  const handleLogoClick = () => {
    navigate('/')
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth"
    });
  }

  return (
    <div className='sticky top-0 z-50 backdrop-blur-md bg-white/80 dark:bg-zinc-900/80 dark:text-white flex items-center justify-around text-center  py-5 lg:py-6'>
        
        <div onClick={handleLogoClick} className="flex items-center gap-2 group cursor-pointer">
          <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center shadow-lg shadow-orange-500/20 group-hover:rotate-12 transition-transform">
            <UtensilsCrossed size={22} strokeWidth={2.5} className="text-white" />
          </div>
          <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r 
            from-gray-900 to-gray-600 
            dark:from-white dark:to-gray-400">
            Foodie<span className="text-orange-500">Go</span>
          </span>
        </div>

        <div className='lg:flex gap-5 hidden'>
          <NavLink to='/' className={({ isActive }) => isActive ? 'text-orange-500 font-semibold' : 'text-black dark:text-white font-semibold hover:text-orange-500'}>Home</NavLink>
          <NavLink to='/about' className={({ isActive }) => isActive ? 'text-orange-500 font-semibold' : 'text-black dark:text-white font-semibold hover:text-orange-500'}>About</NavLink>
          <NavLink to='/contact-us' className={({ isActive }) => isActive ? 'text-orange-500 font-semibold' : 'text-black dark:text-white font-semibold hover:text-orange-500'}>Contact Us</NavLink>
        </div>

        {/* navbar right section */}
        <div className="flex items-center space-x-5">

          <button onClick={toggleDarkMode} className='hidden md:inline-block'>
            {darkMode ? <Sun className="w-6 h-6 text-gray-700 dark:text-gray-200 cursor-pointer hover:scale-105" /> : <Moon className="w-6 h-6 text-gray-700 dark:text-gray-200 cursor-pointer" />}
          </button>

          <button className="relative hidden sm:inline-block" onClick={() => navigate('/cart')}>
            <ShoppingCart className="w-6 h-6 text-gray-700 dark:text-gray-200 cursor-pointer hover:scale-105" />
            
            {cartItems.length > 0 && (
              <span className="absolute -top-2 -left-2 bg-red-500 text-white text-xs px-2 rounded-full">
                {cartItems.length}
              </span>
            )}
          </button>

          <div className="h-8 w-px bg-gray-200 dark:bg-gray-700 hidden sm:block"></div>

          <button onClick={() => navigate('my-account')} className="flex items-center space-x-2 p-1 md:pr-3 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer">
            <div className="w-8 h-8 rounded-full overflow-hidden bg-orange-100 dark:bg-gray-800 flex items-center justify-center border border-gray-200 dark:border-gray-700">
              {userData?.avatar ? (
                <img src={userData.avatar} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <User size={16} className="text-orange-500" />
              )}
            </div>
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300 hidden sm:inline">{userData?.name?.split(' ')[0]}</span>
          </button>
          
          <div className='md:hidden flex items-center justify-center text-center'> 
              <button
                  onClick={() => setIsOpen(!isOpen)}
                  type="button"
                  className="inline-flex items-center justify-center  rounded-md text-gray-400 hover:text-white hover:bg-zinc-800 active:scale-80 transition-all ease-in-out"
                  aria-controls="mobile-menu"
                  aria-expanded="false"
              >
                  {isOpen ? <XIcon size={24} /> : <MenuIcon size={24} />}
              </button>

              <HamburgerButton isOpen={isOpen} setIsOpen={setIsOpen} darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
          </div>
        </div>

    </div>
  )
}

export default Navbar