import React, { useContext, useEffect, useState } from 'react'
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
import Cart from './pages/Cart.jsx'
import CheckoutPage from './pages/Checkout.jsx'
import MyAccount from './pages/MyAccount.jsx'

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
      
      <div className={`dark:bg-gray-950 min-h-[100vh]`}>
        <ToastContainer position='bottom-left'/>
        <Navbar/>
        <Routes>
          <Route path='/' element={<Home/>} />
          <Route path='/about' element={<About/>} />
          <Route path='/contact-us' element={<ContactUs/>} />
          <Route path='/cardview/:id' element={<Cardview/>} />
          <Route path='/cart' element={<Cart/>} />
          <Route path='/cart/place-order' element={<CheckoutPage/>} />
          <Route path='/my-account' element={<MyAccount/>} />
          <Route path='/*' element={<NotFound/>} />
        </Routes>
        <Footer/>
      </div>
    </>
  )
}

export default App