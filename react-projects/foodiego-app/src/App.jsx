import React, { useEffect, useState } from 'react'
import Navbar from './components/Navbar.jsx'
import { Route, Routes, useLocation } from 'react-router-dom'
import Home from './pages/Home'
import Cardview from './components/Cardview.jsx'
import About from './pages/About.jsx'
import ContactUs from './pages/ContactUs.jsx'
import Footer from './components/Footer.jsx'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import NotFound from './components/NotFound.jsx'
import Loader from './components/Loader.jsx'

const App = () => {

  const [loading, setLoading] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setLoading(true);
    const timeout = setTimeout(() => setLoading(false), 700); // short delay
    return () => clearTimeout(timeout);
  }, [location]);

  return (
    <>
      {loading && <Loader/>}
      
      <div className={`dark:bg-gray-900 min-h-[100vh]`}>
        <ToastContainer position='bottom-left'/>
        <Navbar/>
        <Routes>
          <Route path='/' element={<Home/>} />
          <Route path='/about' element={<About/>} />
          <Route path='/contact-us' element={<ContactUs/>} />
          <Route path='/cardview/:id' element={<Cardview/>} />
          <Route path='/*' element={<NotFound/>} />
        </Routes>
        <Footer/>
      </div>
    </>
  )
}

export default App