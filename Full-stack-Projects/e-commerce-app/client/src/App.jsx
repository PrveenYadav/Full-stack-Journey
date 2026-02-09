import React, { useContext, useEffect, useState } from 'react'
import {Navbar} from './components/Navbar.jsx'
import { Navigate, Outlet, Route, Routes, useLocation } from 'react-router-dom'
import Home from './pages/Home'
import {Footer} from './components/Footer.jsx'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import NotFound from './components/NotFound.jsx'
import { AppContext } from './context/AppContext.jsx'
import LoginPage from './pages/admin/LoginPage.jsx'
import { AdminContext } from './context/AdminContext.jsx'
import ScrollManager from './components/ScrollManager.js'
import { UserLogin, VerifyEmail } from './pages/LoginUser.jsx'
import { Cart } from './pages/Cart.jsx'
import { Checkout } from './pages/Checkout.jsx'
import { MyAccount } from './pages/MyAccount.jsx'
import { ShopPage } from './pages/ShopPage.jsx'
import { ProductDetailComponent } from './components/ProductDetailComponent.jsx'
import { CartContext } from './context/CartContext.js'
import AdminHome from './pages/admin/AdminHome.jsx'
import Loader from './components/Loader.jsx'

const App = () => {

  const { isLoggedIn, userData, authLoading } = useContext(AppContext)
  const { isAuthenticated, adminAuthLoading } = useContext(AdminContext)
  const { cart } = useContext(CartContext)

  const PublicLayout = () => (
    <>
      <Navbar cartCount={cart?.length} />
      <Outlet />
      <Footer />
    </>
  );

  const DashboardLayout = () => (
    <>
      <Outlet /> 
    </>
  );

  const MyAccountGuard = () => {
    if (authLoading) {
      return <Loader/>
    }

    if (!isLoggedIn) return <UserLogin />;
    if (!userData?.isAccountVerified) return <VerifyEmail />;
    return <MyAccount />;
  };

  const MyDashboardGuard = () => {
    if (adminAuthLoading) {
      return <Loader/>
    }

    if (isAuthenticated) return <AdminHome />;
    return <LoginPage/>;
  };

  return (
    <>
      <div className={`dark:bg-gray-950 min-h-[100vh] selection:bg-zinc-900 selection:text-white dark:selection:bg-white dark:selection:text-black`}>

        <ToastContainer
          position="top-center"
          autoClose={1500}
          hideProgressBar
          newestOnTop
          closeOnClick
          pauseOnHover
          draggable
          limit={3}
        />
        
        {/* To prevent the borwser to storing the scrolled state and when navigating to any page it starts from top and don't auto scroll */}
        <ScrollManager/>

        <Routes>
          <Route element={<PublicLayout />}>
            <Route path='/' element={<Home />} />
            <Route path="/shop" element={<ShopPage />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/product/:id" element={<ProductDetailComponent />} />
            <Route path="/account" element={<MyAccountGuard />} />
          </Route>

          <Route element={<DashboardLayout />}>
            <Route path='/admin/dashboard' element={<MyDashboardGuard/>} />
          </Route>

          <Route path='/*' element={<NotFound />} />
        </Routes>
      </div>
    </>
  )
}

export default App