import { ArrowLeft, Home } from 'lucide-react'
import React from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'

const NotFound = () => {

  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-red-100 dark:from-zinc-900 dark:to-black text-black dark:text-white px-4">
      
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center max-w-xl"
      >

        {/* Emoji / Icon */}
        <div className="text-6xl mb-4">😕</div>

        {/* 404 */}
        <h1 className="text-7xl sm:text-9xl font-extrabold bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
          404
        </h1>

        {/* Title */}
        <h2 className="text-2xl sm:text-3xl font-bold mt-4">
          Oops! Page not found
        </h2>

        {/* Description */}
        <p className="mt-3 text-gray-600 dark:text-gray-400">
          The page you're looking for doesn’t exist or has been moved.
        </p>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8">

          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all active:scale-95 cursor-pointer"
          >
            <Home size={18} />
            Go Home
          </button>

          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 border border-gray-300 dark:border-zinc-700 px-6 py-3 rounded-xl font-semibold hover:bg-gray-100 dark:hover:bg-zinc-800 transition-all active:scale-95 cursor-pointer"
          >
            <ArrowLeft size={18} />
            Go Back
          </button>

        </div>

      </motion.div>
    </div>
  )
}

export default NotFound