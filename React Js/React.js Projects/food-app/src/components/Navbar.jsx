import React, { useContext, useState } from "react"
import { Moon, Sun, User, ShoppingCart, Search } from "lucide-react";
import Cart from "./Cart.jsx";
import { CartContext } from "../context/CartContext.js";

const Navbar = () => {

  const [darkMode, setDarkMode] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const { cartItems } = useContext(CartContext)

  const toggleDarkMode = () => {
    document.documentElement.classList.toggle("dark");
    setDarkMode(!darkMode);
  };


  return (
    <div className='bg-white dark:bg-gray-900 dark:text-white flex items-center sm:justify-around justify-between text-center pl-10 sm:pl-20 pr-10 sm:pr-20 py-4'>
        <a href='/' className='text-2xl font-bold'>FoodieGo</a>
        <div className='lg:flex gap-5 hidden'>
            <a href="/">Home</a>
            <a href="/about">About</a>
            <a href="/contact">Contact Us</a>
        </div>
        <div className='md:flex md:justify-between md:items-center hidden'>
            <input type="text" placeholder='Search here...' className='outline-none p-2 rounded-l-lg bg-gray-100 dark:bg-gray-800' />
            <button className='py-2.5 px-3 cursor-pointer rounded-r-lg bg-gray-100 dark:bg-gray-800'>
              <Search className="w-6 h-5 text-gray-700 dark:text-gray-200" />
            </button>
        </div>
        <div className='flex justify-between items-center gap-10'>
            <User className="w-6 h-6 text-gray-700 dark:text-gray-200 cursor-pointer md:inline-block hidden" />
            <button className="relative" onClick={() => setIsCartOpen(true)}>
              <ShoppingCart className="w-6 h-6 text-gray-700 dark:text-gray-200 cursor-pointer" />
              
              {cartItems.length > 0 && (
                <span className="absolute -top-2 -left-2 bg-red-500 text-white text-xs px-2 rounded-full">
                  {cartItems.length}
                </span>
              )}
            </button>

            <button onClick={toggleDarkMode}>
              {darkMode ? <Sun className="w-6 h-6 text-gray-700 dark:text-gray-200 cursor-pointer" /> : <Moon className="w-6 h-6 text-gray-700 dark:text-gray-200 cursor-pointer" />}
            </button>
        </div>

        {/* Cart functionalities */}
        {isCartOpen && (
          <div onClick={() => setIsCartOpen(false)} className="fixed inset-0 z-1 backdrop-blur-xs">
            <Cart isCartOpen={isCartOpen} setIsCartOpen={setIsCartOpen}/>
          </div>
        )}

    </div>
  )
}

export default Navbar