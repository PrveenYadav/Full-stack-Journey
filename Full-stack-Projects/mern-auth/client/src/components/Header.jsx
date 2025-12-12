import React, { useContext } from 'react'
import { AppContext } from '../context/AppContext.jsx'

const Header = () => {

  const {userData} = useContext(AppContext)

  return (
    <div className='flex flex-col justify-center text-center items-center mt-50'>
        <h1 className='text-4xl font-bold'>Hey {userData ? userData.name : 'Developer'}</h1>
        <p>Welcome to our site and keep progressing in your life</p>
    </div>
  )
}

export default Header