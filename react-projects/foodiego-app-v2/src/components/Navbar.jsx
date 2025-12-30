import React, { useContext, useEffect, useState } from "react"
import { Moon, Sun, User, ShoppingCart, X, XIcon, MenuIcon } from "lucide-react";
import { CartContext } from "../context/CartContext.js";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from 'framer-motion'
import { HamburgerButton } from "./Hamburger.jsx";
import { AppContext } from "../context/AppContext.jsx";

const Navbar = () => {

  const [isMenubarOpen, setIsMenubarOpen] = useState(false);
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

  // Step 3: Toggle function
  const toggleDarkMode = () => {
    setDarkMode((prev) => !prev);
  };

  const { userData } = useContext(AppContext)

  return (
    <div className='sticky top-0 z-10 backdrop-blur-md bg-white/80 dark:bg-gray-900/80 dark:text-white flex items-center justify-around text-center sm:pl-20 sm:pr-20 py-5 lg:py-6'>

        <div className='md:hidden'> 
            <button
                onClick={() => setIsOpen(!isOpen)}
                type="button"
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-slate-800 active:scale-80 transition-all ease-in-out"
                aria-controls="mobile-menu"
                aria-expanded="false"
            >
                {isOpen ? <XIcon size={24} /> : <MenuIcon size={24} />}
            </button>

            {/* Hamburger component */}
            <HamburgerButton isOpen={isOpen} setIsOpen={setIsOpen} />
        </div>

        <div className="flex gap-3 items-center">
          {/* <button onClick={() => setIsMenubarOpen(true)}><Menu className="h-7 w-7 lg:hidden"/></button> */}
          <Link to="/" className="group text-2xl font-bold transition-all duration-300 hover:scale-105 ease-in-out">
            <span className="text-black dark:text-white group-hover:text-amber-500 transition-all duration-300 hover:scale-105 ease-in-out">Foodie</span>
            <span className="text-amber-500 group-hover:text-black dark:group-hover:text-white transition-all duration-300 hover:scale-105 ease-in-out">Go</span>
          </Link>
        </div>

      
        <AnimatePresence>
          {isMenubarOpen && (
            <motion.div 
              initial={{ opacity: 1, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 100 }}
              transition={{ duration: 0.2 }}
              className="fixed top-0 w-full inset-0 z-50 backdrop-blur p-5 lg:hidden gap-5 flex flex-col items-start shadow-md"
            >
              <button onClick={() => setIsMenubarOpen(false)}>
                <X className="w-6 h-6 text-gray-600 dark:text-gray-300 cursor-pointer hover:text-amber-500 transition-all ease-in duration-200" />
              </button>
              <div className="flex flex-col justify-center items-start gap-2">
                <NavLink onClick={() => setIsMenubarOpen(false)} to='/' className={({ isActive }) => isActive ? 'text-yellow-500 font-semibold' : 'text-black dark:text-white font-semibold hover:text-yellow-500'}>Home</NavLink>
                <NavLink onClick={() => setIsMenubarOpen(false)} to='/about' className={({ isActive }) => isActive ? 'text-yellow-500 font-semibold' : 'text-black dark:text-white font-semibold hover:text-yellow-500'}>About</NavLink>
                <NavLink onClick={() => setIsMenubarOpen(false)} to='/contact-us' className={({ isActive }) => isActive ? 'text-yellow-500 font-semibold' : 'text-black dark:text-white font-semibold hover:text-yellow-500'}>Contact Us</NavLink>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className='lg:flex gap-5 hidden'>
          <NavLink to='/' className={({ isActive }) => isActive ? 'text-amber-500 font-semibold' : 'text-black dark:text-white font-semibold hover:text-amber-500'}>Home</NavLink>
          <NavLink to='/about' className={({ isActive }) => isActive ? 'text-amber-500 font-semibold' : 'text-black dark:text-white font-semibold hover:text-amber-500'}>About</NavLink>
          <NavLink to='/contact-us' className={({ isActive }) => isActive ? 'text-amber-500 font-semibold' : 'text-black dark:text-white font-semibold hover:text-amber-500'}>Contact Us</NavLink>
        </div>

        {/* navbar right section */}
        <div className="flex items-center space-x-5">
          {/* <div className="h-8 w-px bg-gray-200 dark:bg-gray-700 hidden sm:block"></div> */}

          <button onClick={toggleDarkMode}>
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

          <button onClick={() => navigate('my-account')} className="flex items-center space-x-2 p-1 pr-3 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer">
            <div className="w-8 h-8 rounded-full overflow-hidden bg-orange-100 dark:bg-gray-800 flex items-center justify-center border border-gray-200 dark:border-gray-700">
              {userData?.avatar ? (
                <img src={userData.avatar} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <User size={16} className="text-amber-500" />
              )}
            </div>
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300 hidden sm:inline">{userData?.name?.split(' ')[0]}</span>
          </button>
        </div>
    </div>
  )
}

export default Navbar