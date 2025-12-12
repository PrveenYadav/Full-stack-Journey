import React from 'react'
import Home from './pages/Home'
import { Route, Routes } from 'react-router-dom'
import Login from './pages/Login.jsx'
import ResetPass from './pages/ResetPass.jsx'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { EmailVerify } from './pages/EmailVefify.jsx'
import ChangePassword from './pages/ChangePassword.jsx'

const App = () => {
  return (
    <div className='h-screen w-screen text-white bg-black/90'>
      <ToastContainer/>
      <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path='/login' element={<Login/>}/>
        <Route path='/reset-pass' element={<ResetPass/>}/>
        <Route path='/email-verify' element={<EmailVerify/>}/>
        <Route path='/change-password' element={<ChangePassword/>}/>
      </Routes>
    </div>
  )
}

export default App