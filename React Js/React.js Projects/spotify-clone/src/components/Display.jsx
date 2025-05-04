import React, { useEffect, useRef } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import DisplayHome from './DisplayHome'
import DisplayAlbum from './DisplayAlbum'
import { albumsData } from '../assets/assets'

const Display = () => {

  const displayRef = useRef();
  const location = useLocation(); //For pathname
  const isAlbum = location.pathname.includes("album");
  const albumId = isAlbum ? location.pathname.slice(-1) : ""; //if it is album then we will get the id
  const bgColor = albumsData[Number(albumId)].bgColor; //getting the bgcolor of every album by their id
  
  useEffect(() => {
    if(isAlbum) {
      displayRef.current.style.background = `linear-gradient(${bgColor}, #121212)`
    }
    else {
      displayRef.current.style.background = `#121212`
    }
  })

  return (
    <div ref={displayRef} className='w-[100%] m-2 pt-4 px-6 rounded bg-[#121212] text-white overflow-auto lg:w-[75%] lg:ml-0'>
        <Routes>
            <Route path='/' element={<DisplayHome/>} />
            <Route path='/album/:id' element={<DisplayAlbum/>} />
        </Routes>
    </div>
  )
}

export default Display