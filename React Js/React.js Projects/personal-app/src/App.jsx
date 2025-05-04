import React, { useState } from 'react'
import Navbar from './component/Navbar';
import Home from './component/Home';
import { Routes, Route } from 'react-router-dom';
import About from './component/About';
import Contact from './component/Contact';

function App() {

  return (
    <div className='h-screen bg-[#212121] text-white'>
      
      <Navbar/>
      
      <Routes>
        <Route path='/home' element={<Home/>} />
        <Route path='/about' element={<About/>} />
        <Route path='/contact' element={<Contact/>} />
      </Routes>
    </div>
  )
}

export default App