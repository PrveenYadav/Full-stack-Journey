import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { useContext } from 'react'
import { AppContext } from '../context/AppContext.jsx'
import { toast } from 'react-toastify'

const Login = () => {
    
    const [state, setState] = useState('Sign Up')
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const navigate = useNavigate()

    const { backendUrl, setIsLoggedIn, getUserData } = useContext(AppContext)

    const handleSubmit = async (e) => {
        try {
            e.preventDefault();

            // sending cookies
            axios.defaults.withCredentials = true

            if (state === 'Sign Up') {
                const {data} = await axios.post(backendUrl + '/api/auth/register', {name, email, password})

                if (data.success) {
                    setIsLoggedIn(true)
                    getUserData()
                    navigate('/')
                    toast.success(data.message)
                } else {
                    toast.error(data.message)
                }
            } else {
                const {data} = await axios.post(backendUrl + '/api/auth/login', {email, password})

                if (data.success) {
                    setIsLoggedIn(true)
                    getUserData()
                    navigate('/')
                    toast.success(data.message)
                }
                else {
                    toast.error(data.message)
                }
            }
    
        } catch (error) {
            toast.error(error?.response?.data?.message || "Error in Signing Up")
        }

        setName('')
        setPassword('')
        setEmail('')
    }

  return (
    <div>
        <button onClick={() => navigate('/')} className='text-2xl pt-5 pl-10 font-bold hover:scale-105 cursor-pointer'>Mern Auth</button>
        <div className='flex flex-col justify-center items-center ml-[40%] mt-[10%] w-80 h-fit p-5 rounded bg-gray-800 shadow-md text-center gap-5'>
            <div>
                <h2 className='font-bold text-2xl'>{state === 'Sign Up' ? 'Sign-Up' : 'Login'}</h2>
                <p className='text-gray-400 mt-1'>{state === 'Sign Up' ? 'Create your account' : 'Login your account'}</p>
            </div>

            <form onSubmit={handleSubmit} className='flex flex-col gap-3'>
                { state === 'Sign Up' && (
                    <div className='flex flex-col gap-3'>
                        <input 
                            type="text" 
                            placeholder='Full Name' 
                            value={name}
                            onChange={(e)=>setName(e.target.value)}
                            className='rounded-2xl border border-gray-700 outline-none px-3 p-2'
                        />
                    </div>
                )}   

                <input 
                    type="email" 
                    placeholder='your@gmail.com' 
                    value={email}
                    onChange={(e)=>setEmail(e.target.value)}
                    className='rounded-2xl border border-gray-700 outline-none px-3 p-2'
                />
                <input 
                    type="password" 
                    placeholder='your123'
                    value={password}
                    onChange={(e)=>setPassword(e.target.value)}
                    className='rounded-2xl outline-none border border-gray-700 px-3 p-2'
                />
                    
                <p onClick={() => navigate('/reset-pass')} className='text-sm text-blue-500 cursor-pointer hover:underline'>forget password?</p> 
                <button type='submit' className='border bg-white/90 text-black font-semibold px-3 py-2 rounded-2xl w-auto cursor-pointer'>{state}</button>
            </form> 

            {state === 'Sign Up' ? (<p className='text-xs text-gray-400'>Already have an account?{' '} <span onClick={() => setState('Login')} className='text-blue-500 hover:underline cursor-pointer'>Login here</span></p>) : (<p className='text-xs text-gray-400'>Don't have an account?{' '} <span onClick={() => setState('Sign Up')} className='text-blue-500 hover:underline cursor-pointer'>Sign Up here</span></p>)}               
        </div>
    </div>
  )
}

export default Login