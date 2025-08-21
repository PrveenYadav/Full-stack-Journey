import React, { useState } from 'react'
import Navbar from '../components/Navbar'
import Card from '../components/Card'
import Footer from '../components/Footer'

const Home = () => {

  const [selectedCategory, setSelectedCategory] = useState("all");

  // Handle category change
  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
  };

  return (
    <div>
        <Card category={selectedCategory} handleCategory={handleCategoryClick}/>
        <Footer/>
    </div>
  )
}

export default Home