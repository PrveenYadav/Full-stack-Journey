import React, { useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { AppContext } from '../context/AppContext.jsx'
import { toast } from 'react-toastify'
import axios from 'axios'

const Navbar = () => {

  const navigate = useNavigate()
  const {isLoggedIn, setIsLoggedIn, backendUrl, setUserData, userData} = useContext(AppContext)


  const handleLogout = async () => {
    try {
      // send cookies (because we're using httpOnly cookie for auth)
      axios.defaults.withCredentials = true

      const { data } = await axios.post(backendUrl + "/api/auth/logout")

      if (data.success) {
        setIsLoggedIn(false)
        setUserData(null)
        toast.success(data.message || "Logout successfully")
        navigate("/")
      }
    } catch (error) {
      console.log(error)
      // because of axios - we direct don't get like - error.message. we do like -> error.response.data.message
      const message = error?.response?.data?.message || error.message || "Logout failed, please try again"
      toast.error(message)
    }
  }

  const sendVerificationOtp = async () => {
    try {
      axios.defaults.withCredentials = true
      const { data } = await axios.post(backendUrl + '/api/auth/send-verify-otp')

      if (data.success) {
        navigate('/email-verify')
        toast.success(data.message)
      } else {
        toast.error(data.message)
      }

    } catch (error) {
      toast.error(error?.response?.data?.message || "Error in Sending OTP")
    }
  }

  return (
    <div className='flex justify-around pt-5'>
        <h1 onClick={()=>navigate('/')} className='text-3xl font-bold cursor-pointer'>Mern Auth</h1>

        { isLoggedIn ? (
          <ol className='flex flex-col gap-2'>
            <button onClick={handleLogout} className='p-2 px-3 rounded border hover:bg-white bg-white/10 hover:text-black text-white font-semibold text-xl'>Logout</button>
            <button onClick={sendVerificationOtp} className={` ${userData?.isAccountVerified ? 'hidden' : 'inline-block'} p-2 px-3 rounded border hover:bg-white bg-white/10 hover:text-black text-white font-semibold text-xl`}>Verify Email</button>
          </ol>
        ):
          (<button onClick={() => navigate('/login')} className='flex gap-2 items-center p-2 px-3 rounded border hover:bg-white bg-white/10 hover:text-black text-white font-semibold text-xl'>Login<ArrowRight className='w-6 h-6'/></button>
        )}
    </div>
  )
}

export default Navbar