import React, { useEffect, useState } from 'react'
import Card from '../components/Card.jsx'
import { useLocation } from 'react-router-dom';
import Loader from '../components/Loader.jsx';

const Home = () => {

  const [selectedCategory, setSelectedCategory] = useState("all");

  // Handle category change
  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
  };

  const [loading, setLoading] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setLoading(true);
    const timeout = setTimeout(() => setLoading(false), 700); // short delay
    return () => clearTimeout(timeout);
  }, [location]);

  return (
    <div>
        {loading && <Loader/>}
        <Card category={selectedCategory} handleCategory={handleCategoryClick}/>
    </div>
  )
}

export default Home