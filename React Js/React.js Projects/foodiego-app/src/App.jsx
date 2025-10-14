import React from 'react'
import Navbar from './components/Navbar.jsx'
import { Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import Cardview from './components/Cardview.jsx'
import About from './pages/About.jsx'
import ContactUs from './pages/ContactUs.jsx'
import Footer from './components/Footer.jsx'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const App = () => {

  return (
    <div className={`dark:bg-gray-900 min-h-[100vh]`}>
      <ToastContainer position='bottom-left'/>
      <Navbar/>
      <Routes>
        <Route path='/' element={<Home/>} />
        <Route path='/about' element={<About/>} />
        <Route path='/contact-us' element={<ContactUs/>} />
        <Route path='/cardview/:id' element={<Cardview/>} />
      </Routes>
      <Footer/>
    </div>
  )
}

export default App