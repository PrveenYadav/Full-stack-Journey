import React from 'react'
import { Link, Route, Routes } from 'react-router-dom'
import Home from './Home'

function Navbar() {

  return (
        <div className='h-[10%] bg-violet-500 text-white flex items-center justify-around'>
            <h1 className='text-3xl font-bold cursor-pointer'><Link to="/home">Arino</Link></h1>
            <div className='flex justify-between items-center gap-10 font-semibold'>
                <p className='cursor-pointer '><Link to="/home">Home</Link></p>
                <p className='cursor-pointer '><Link to="/about">About</Link></p>
                <p className='cursor-pointer '><Link to="/contact">Contact Us</Link></p>
            </div>
            <form>
                <input
                    className='border-1 rounded-2xl px-4 py-2'
                    type="text" 
                    placeholder='Search' 
                />
            </form>
        </div>
  )
}

export default Navbar