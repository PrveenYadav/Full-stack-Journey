import React from 'react'
import Navbar from '../components/Navbar'
import Header from '../components/Header'
import Bloglist from '../components/Bloglist'
import Card from '../components/Card'
import NewsLetter from '../components/NewsLetter'

const Home = () => {
  return (
    <>
        <Navbar/>
        <Header/>
        <Bloglist/>
        <NewsLetter/>
    </>
  )
}

export default Home