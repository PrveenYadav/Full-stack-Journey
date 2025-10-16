import React, { useContext, useEffect, useState } from "react"
import { Moon, Sun, User, ShoppingCart, Search, Menu, X } from "lucide-react";
import Cart from "./Cart.jsx";
import { CartContext } from "../context/CartContext.js";
import { Link, NavLink } from "react-router-dom";
import { motion, AnimatePresence } from 'framer-motion'

const Navbar = () => {

  const [isMenubarOpen, setIsMenubarOpen] = useState(false);

  const { cartItems, isCartOpen, setIsCartOpen, searchQuery, setSearchQuery } = useContext(CartContext);

  // const toggleDarkMode = () => {
  //   document.documentElement.classList.toggle("dark");
  //   setDarkMode(!darkMode);
  // };

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


  return (
    <div className='bg-white dark:bg-gray-900 dark:text-white flex items-center sm:justify-around justify-between text-center pl-10 sm:pl-20 pr-10 sm:pr-20 py-4'>
        <div className="flex gap-3 items-center">
          <button onClick={() => setIsMenubarOpen(true)}><Menu className="h-7 w-7 lg:hidden"/></button>
          <Link to="/" className="group text-2xl font-bold transition-all duration-300 hover:scale-105 ease-in-out">
            <span className="text-white group-hover:text-yellow-500 transition-all duration-300 hover:scale-105 ease-in-out">Foodie</span>
            <span className="text-yellow-500 group-hover:text-white transition-all duration-300 hover:scale-105 ease-in-out">Go</span>
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
          <NavLink to='/' className={({ isActive }) => isActive ? 'text-yellow-500 font-semibold' : 'text-black dark:text-white font-semibold hover:text-yellow-500'}>Home</NavLink>
          <NavLink to='/about' className={({ isActive }) => isActive ? 'text-yellow-500 font-semibold' : 'text-black dark:text-white font-semibold hover:text-yellow-500'}>About</NavLink>
          <NavLink to='/contact-us' className={({ isActive }) => isActive ? 'text-yellow-500 font-semibold' : 'text-black dark:text-white font-semibold hover:text-yellow-500'}>Contact Us</NavLink>
        </div>
        <div className='md:flex md:justify-between md:items-center hidden'>
            <input 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              type="text" 
              placeholder='Search here...' 
              className='outline-none p-2 rounded-l-lg bg-gray-100 dark:bg-gray-800' 
            />
            <button className='py-2.5 px-3 cursor-pointer rounded-r-lg bg-gray-100 dark:bg-gray-800'>
              <Search className="w-6 h-5 text-gray-700 dark:text-gray-200 hover:scale-105" />
            </button>
        </div>
        <div className='flex justify-between items-center gap-10'>
            <Link to='contact-us'><User className="w-6 h-6 text-gray-700 dark:text-gray-200 cursor-pointer md:inline-block hidden hover:scale-105" /></Link>
            <button className="relative" onClick={() => setIsCartOpen(true)}>
              <ShoppingCart className="w-6 h-6 text-gray-700 dark:text-gray-200 cursor-pointer hover:scale-105" />
              
              {cartItems.length > 0 && (
                <span className="absolute -top-2 -left-2 bg-red-500 text-white text-xs px-2 rounded-full">
                  {cartItems.length}
                </span>
              )}
            </button>

            <button onClick={toggleDarkMode}>
              {darkMode ? <Sun className="w-6 h-6 text-gray-700 dark:text-gray-200 cursor-pointer hover:scale-105" /> : <Moon className="w-6 h-6 text-gray-700 dark:text-gray-200 cursor-pointer" />}
            </button>
        </div>

        {/* Cart functionalities */}
        <AnimatePresence>
          {isCartOpen && (
            <motion.div
              onClick={() => setIsCartOpen(false)}
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 100 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 z-50 backdrop-blur-xs"
            >
              <Cart/>
            </motion.div>
          )}
        </AnimatePresence>
        {/* {isCartOpen && (
          <div onClick={() => setIsCartOpen(false)} className={`fixed inset-0 z-50 backdrop-blur-xs`}>
            <Cart isCartOpen={isCartOpen} setIsCartOpen={setIsCartOpen}/>
          </div>
        )} */}

    </div>
  )
}

export default Navbar