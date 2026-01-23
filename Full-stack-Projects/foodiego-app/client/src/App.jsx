import React, { useContext, useEffect, useState } from 'react'
import Navbar from './components/Navbar.jsx'
import { Navigate, Outlet, Route, Routes, useLocation } from 'react-router-dom'
import Home from './pages/Home'
import About from './pages/About.jsx'
import ContactUs from './pages/ContactUs.jsx'
import Footer from './components/Footer.jsx'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import NotFound from './components/NotFound.jsx'
import Cart from './pages/Cart.jsx'
import CheckoutPage from './pages/Checkout.jsx'
import { AppContext } from './context/AppContext.jsx'
import MyAccount from './pages/MyAccount.jsx'
import Dashboard from './pages/admin/Dashboard.jsx'
import LoginPage from './pages/admin/LoginPage.jsx'
import { ProductView } from './components/ProductView.jsx'
import { AdminContext } from './context/AdminContext.jsx'
import ScrollManager from './components/ScrollManager.js'
import { UserLogin, VerifyEmail } from './pages/LoginUser.jsx'


const App = () => {

  const [loading, setLoading] = useState(false);
  const location = useLocation();
  const { isLoggedIn, setIsLoggedIn, userData } = useContext(AppContext)
  const { isAuthenticated } = useContext(AdminContext)

  // useEffect(() => {
  //   setLoading(true);
  //   const timeout = setTimeout(() => setLoading(false), 700); // short delay
  //   return () => clearTimeout(timeout);
  // }, [location]);


  const PublicLayout = () => (
    <>
      <Navbar />
      <Outlet />
      <Footer />
    </>
  );

  const DashboardLayout = () => (
    // outlet is a placeholder component provided by React Router
    <>
      <Outlet /> 
    </>
  );

  const MyAccountGuard = () => {
    if (!isLoggedIn) return <UserLogin />;
    if (!userData?.isAccountVerified) return <VerifyEmail />;
    return <MyAccount />;
  };

  return (
    <>
      {/* {loading && <Loader/>} */}
      
      <div className={`dark:bg-gray-950 min-h-[100vh]`}>
        <ToastContainer position='bottom-left'/>
        
        {/* To prevent the borwser to storing the scrolled state and when navigating to any page it starts from top and don't auto scroll */}
        <ScrollManager/>

        <Routes>
          <Route element={<PublicLayout />}>
            <Route path='/' element={<Home />} />
            <Route path='/about' element={<About />} />
            <Route path='/product-view/:id' element={<ProductView/>} />
            <Route path='/contact-us' element={<ContactUs />} />
            <Route path='/cart' element={<Cart />} />
            <Route path="/my-account" element={<MyAccountGuard />} />
          </Route>

          <Route element={<DashboardLayout />}>
            <Route path='/admin/dashboard' element={isAuthenticated ? <Dashboard /> : <LoginPage/>} />
          </Route>

          <Route path='/*' element={<NotFound />} />
        </Routes>
      </div>
    </>
  )
}

export default App