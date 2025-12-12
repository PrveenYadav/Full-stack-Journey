import axios from 'axios';
import React, { useEffect } from 'react';
import { useContext } from 'react';
import { AppContext } from '../context/AppContext.jsx';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

export const EmailVerify = () => {

    const { backendUrl, isLoggedIn, userData, getUserData} = useContext(AppContext)
    const navigate = useNavigate()
    const inputRefs = React.useRef([])

    const handleInput = (e, index) => {
      if (e.target.value.length > 0 && index < inputRefs.current.length - 1) {
        inputRefs.current[index + 1].focus();
      }
    }

    const handleKeyDown = (e, index) => {
      if (e.key === 'Backspace' && e.target.value === '' && index > 0) {
        inputRefs.current[index - 1].focus();
      }
    }

    const handlePaste = (e, index) => {
      const paste = e.clipboardData.getData('text')
      const pasteArray = paste.split('');
      pasteArray.forEach((char, index) => {
        if (inputRefs.current[index]) {
          inputRefs.current[index].value = char
        }
      })
    }


    const onSubmitHandler = async (e) => {
      try {
        e.preventDefault()
        const otpArray = inputRefs.current.map(e => e.value)
        const otp = otpArray.join('')
        
        const { data } = await axios.post(backendUrl + '/api/auth/verify-account', {otp})

        if (data.success) {
          toast.success(data.message)
          getUserData()
          navigate('/')
        }
      } catch (error) {
        console.log(error)
        toast.error(error?.response?.data?.message || "Invalid or Expired OTP")
      }
    }

    useEffect(() => {
      isLoggedIn && userData && userData.isAccountVerified && navigate('/')
    }, [isLoggedIn, userData])

    return (
      <div className='flex justify-center items-center pt-[10%]'>
        <form onSubmit={onSubmitHandler} className='w-100 h-fit border-2 border-white flex flex-col gap-5 p-5 rounded-2xl'>
          <div>
            <h1 className='font-bold text-2xl'>Email Verify OTP</h1>
            <p>Enter the 6 digit code sent on your email</p>
          </div>
          <div className='flex gap-2' onPaste={handlePaste}>
              {Array(6).fill(0).map((_, index) => (
                <input 
                  type='text' 
                  maxLength='1' key={index} 
                  required 
                  ref={e => inputRefs.current[index] = e} 
                  onInput={(e) => handleInput(e, index)} 
                  onKeyDown={(e) => handleKeyDown(e, index)}
                  className='w-12 h-12 text-white border-2 border-white text-center'
                />
              ))}
          </div>
          <button className='cursor-pointer p-2 px-3 rounded border hover:bg-white bg-white/10 hover:text-black text-white font-semibold text-xl'>Verify Email</button>
        </form>
      </div>
    );
};
