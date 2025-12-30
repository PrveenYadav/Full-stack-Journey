import React from 'react'
import { Mail } from 'lucide-react';

const Footer = () => {

    const handleSubmit = (e) => {
        e.preventDefault();

    }
    
  return (
    <div className='dark:text-white lg:h-70 max-w-full px-10 md:px-22 flex flex-col justify-center mt-10'>
        <p className='border-1 opacity-10 px-30 mb-5'></p>
        <div className='w-[93%] sm:flex sm:justify-between gap-5 sm:pb-5 flex-wrap'>

            <div className='md:w-[25%] flex flex-col gap-2 mb-7 sm:mb-auto'>
                <a href='#' className='text-2xl font-bold'>Foodie<span className="text-yellow-500">Go</span></a>
                <p className='opacity-65 text-sm'>The most trusted fast food resturant. Get what you wish, eat what you need and order what you see.</p>
                <div className='flex gap-4 mt-2'>
                    <a className='h-6 w-6' href="https://www.facebook.com"><img className='h-5 hover:h-6 transition-all duration-200 ease-in-out' src="facebook1.png" alt="" /></a>
                    <a className='h-6 w-6' href="https://x.com"><img className='h-5 hover:h-6 transition-all duration-200 ease-in-out' src="twitter1.png" alt="" /></a>
                    <a className='h-6 w-6' href="https://www.instagram.com"><img className='h-5 hover:h-6 transition-all duration-200 ease-in-out' src="instagram.png" alt="" /></a>
                </div>
            </div>

            <div className='hidden md:inline-block'>
                <h1 className='text-xl font-bold'>Quick Links</h1>
                <div className='flex flex-col'>
                    <a className='opacity-65 hover:opacity-100 transition-all duration-100' href="/">Home</a>
                    <a className='opacity-65 hover:opacity-100 transition-all duration-100' href="/about">About</a>
                    <a className='opacity-65 hover:opacity-100 transition-all duration-100' href="/faq">FAQ</a>
                    <a className='opacity-65 hover:opacity-100 transition-all duration-100' href="/contact-us">Contact Us</a>
                </div>
            </div>

            <div className='hidden md:inline-block'>
                <h1 className='text-xl font-bold'>Categories</h1>
                <div className='flex flex-col'>
                    <a className='opacity-65 hover:opacity-100 transition-all duration-100' href="/fast-food">Fast food</a>
                    <a className='opacity-65 hover:opacity-100 transition-all duration-100' href="/veg">Veg</a>
                    <a className='opacity-65 hover:opacity-100 transition-all duration-100' href="/non-veg">Non-Veg</a>
                    <a className='opacity-65 hover:opacity-100 transition-all duration-100' href="/cheese">cheese</a>
                </div>
            </div>

            <div className='flex-col gap-2 hidden xl:inline-block'>
                <h1 className='text-xl font-bold'>Connect with us</h1>
                <p className='opacity-75'>Subscribe to get updates of new products with great offers.</p>
                <form onSubmit={handleSubmit} className='flex mt-5'>
                    <input className='outline-none bg-gray-100 dark:bg-gray-800 dark:text-white rounded-l-lg px-3 py-2' type="text" placeholder='Enter your email...' />
                    <button className='bg-gray-100 dark:bg-gray-800 border-none rounded-r-lg py-1 px-2 cursor-pointer'><Mail className='h-8 text-black dark:text-gray-100' /></button>
                </form>
            </div>
        </div>

        <p className='border-1 opacity-10 mt-5 md:mt-auto'></p>

        <div className='md:flex flex-wrap md:justify-between w-full pt-5 pb-5'>
            <p>© 2025 FoodieGo. All rights reserved.</p>
            <div className='flex flex-col sm:flex-row sm:gap-5'>
                <p className='opacity-65 hover:opacity-100 transition-all duration-100 cursor-pointer'>Privacy Policy</p>
                <p className='opacity-65 hover:opacity-100 transition-all duration-100 cursor-pointer'>Terms of Service</p>
                <p className='opacity-65 hover:opacity-100 transition-all duration-100 cursor-pointer'>Cookie Policy</p>
            </div>
        </div>
    </div>
  )
}

export default Footer