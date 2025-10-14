import React, { useState } from 'react'
import Card from '../components/Card.jsx'
import Footer from '../components/Footer.jsx'

const Home = () => {

  const [selectedCategory, setSelectedCategory] = useState("all");

  // Handle category change
  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
  };

  return (
    <div>
        <Card category={selectedCategory} handleCategory={handleCategoryClick}/>
        {/* <Footer/> */}
    </div>
  )
}

export default Home