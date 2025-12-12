import axios from 'axios'
import React, { useContext, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { AppContext } from '../context/AppContext.jsx'

const ResetPass = () => {

  const [email, setEmail] = useState()
  const navigate = useNavigate()
  const { backendUrl } = useContext(AppContext)

  const handleSubmit = async (e) => {
    e.preventDefault();

    axios.defaults.withCredentials = true

    try {
      const { data } = await axios.post(backendUrl + '/api/auth/send-reset-otp', {email})
      
      if (data.success) {
        toast.success(data.message)
        navigate('/change-password')
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message || 'Error in Resetting OTP')
    }
  }

  return (
    <div>
      <button onClick={() => navigate('/')} className='text-2xl pt-5 pl-10 font-bold hover:scale-105 cursor-pointer'>Mern Auth</button>

      <div className='flex flex-col justify-center items-center ml-[40%] mt-[10%] w-80 h-fit p-5 rounded bg-gray-800 shadow-md text-center gap-5'>
        <div>
          <h2 className='font-bold text-2xl'>Reset Password</h2>
          <p className='text-gray-400 mt-1'>Enter your email to send password reset otp</p>
        </div>

        <form onSubmit={handleSubmit} className='flex flex-col gap-3'>
            <input 
                type="email" 
                placeholder='your@gmail.com' 
                value={email}
                onChange={(e)=>setEmail(e.target.value)}
                className='rounded-2xl border border-gray-700 outline-none px-3 p-2'
            />
            <button type='submit' className='border bg-white/90 text-black font-semibold px-3 py-2 rounded-2xl w-auto cursor-pointer'>Send OTP</button>
        </form>             
      </div>
    </div>
  )
}

export default ResetPass