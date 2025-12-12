import React, { useContext, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AppContext } from '../context/AppContext.jsx'
import { toast } from 'react-toastify'
import axios from 'axios'

const ChangePassword = () => {

  const [email, setEmail] = useState()
  const [newPassword, setNewPassword] = useState()
  const [otp, setOtp] = useState()
  
  const navigate = useNavigate()
  const { backendUrl } = useContext(AppContext) 

  const handleSubmit = async (e) => {
    e.preventDefault();

    axios.defaults.withCredentials = true

    try {
      const { data } = await axios.post(backendUrl + '/api/auth/reset-password', {email, otp, newPassword})
      
      if (data.success) {
        toast.success(data.message)
        // navigate('/login')
        navigate('/')
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message || 'Error in Changing Password')
    }

  }

  return (
    <div>
      <button onClick={() => navigate('/')} className='text-2xl pt-5 pl-10 font-bold hover:scale-105 cursor-pointer'>Mern Auth</button>

      <div className='flex flex-col justify-center items-center ml-[40%] mt-[10%] w-80 h-fit p-5 rounded bg-gray-800 shadow-md text-center gap-5'>
        <div>
          <h2 className='font-bold text-2xl'>Change Password</h2>
          <p className='text-gray-400 mt-1'>Enter your email, otp and new password</p>
        </div>

        <form onSubmit={handleSubmit} className='flex flex-col gap-3'>
            <input 
                type="email" 
                placeholder='your@gmail.com' 
                value={email}
                onChange={(e)=>setEmail(e.target.value)}
                className='rounded-2xl border border-gray-700 outline-none px-3 p-2'
            />
            <input 
                type="password" 
                placeholder='new password' 
                value={newPassword}
                onChange={(e)=>setNewPassword(e.target.value)}
                className='rounded-2xl border border-gray-700 outline-none px-3 p-2'
            />
            <input 
                type="text" 
                placeholder='your otp' 
                value={otp}
                onChange={(e)=>setOtp(e.target.value)}
                className='rounded-2xl border border-gray-700 outline-none px-3 p-2'
            />
            <button type='submit' className='border bg-white/90 text-black font-semibold px-3 py-2 rounded-2xl w-auto cursor-pointer'>Change Password</button>
        </form>             
      </div>
    </div>
  )
}

export default ChangePassword