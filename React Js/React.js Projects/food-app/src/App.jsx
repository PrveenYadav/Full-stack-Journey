import React from 'react'
import Navbar from './components/Navbar.jsx'
import { Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import Cardview from './components/Cardview.jsx'

const App = () => {

  return (
    <div className={`dark:bg-gray-900 min-h-[100vh]`}>
      <Navbar/>
      <Routes>
        <Route path='/' element={<Home/>} />
        <Route path='/cardview/:id' element={<Cardview/>} />
      </Routes>
    </div>
  )
}

export default App