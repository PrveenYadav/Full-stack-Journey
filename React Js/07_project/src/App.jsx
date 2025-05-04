import React from 'react'
import './App.css'
import Login from './components/Login'
import Profile from './components/Profile'
import UserContextProvider from './context/UserContextProvider'

function App() {

  return (
    <UserContextProvider>
      <h1 className='bg-black text-white'>Today Started Context API in React.js</h1>
      <Login />
      <Profile/>
    </UserContextProvider>
  )
}

export default App
