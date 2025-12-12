import React, { useState } from 'react'
import Card from '../components/Card.jsx'

const Home = () => {

  const [selectedCategory, setSelectedCategory] = useState("all");

  // Handle category change
  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
  };

  return (
    <Card category={selectedCategory} handleCategory={handleCategoryClick}/>
  )
}

export default Home