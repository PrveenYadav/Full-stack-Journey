import React from 'react'
import Navbar from './components/Navbar'
import { Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import Cardview from './components/Cardview'

const App = () => {

  return (
    <div className='dark:bg-gray-900 h-full sm:max-w-screen'>
      <Navbar/>
      <Routes>
        <Route path='/' element={<Home/>} />
        <Route path='/cardview/:id' element={<Cardview/>} />
      </Routes>
    </div>
  )
}

export default App