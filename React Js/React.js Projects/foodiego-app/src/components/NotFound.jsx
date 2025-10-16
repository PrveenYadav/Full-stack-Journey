import { ArrowLeft } from 'lucide-react'
import React from 'react'
import { useNavigate } from 'react-router-dom'

const NotFound = () => {

    const navigate = useNavigate();

  return (
    <div className='w-full h-80 bg-white dark:bg-gray-900 text-black dark:text-white flex flex-col justify-center items-center gap-5'>
        <div className='flex flex-col items-center gap-2'>
            <h1 className='text-6xl sm:text-9xl font-extrabold text-red-500'>404</h1>
            <h2 className='text-2xl sm:text-3xl font-bold'>Oops! Page not found.</h2>
            <p className='opacity-60 sm:w-[60%] text-center'>The page you're looking for doesn't exist. It might have been moved, deleted, or you might have mistyped the URL.</p>
        </div>
        <button onClick={() => navigate('/')} className='flex gap-1 bg-amber-400 p-2 text-black font-semibold hover:scale-105 hover:opacity-90 rounded cursor-pointer transition-all duration-200 ease-in-out'><ArrowLeft className='h-6 w-6'/>Go Back Home</button>
    </div>
  )
}

export default NotFound