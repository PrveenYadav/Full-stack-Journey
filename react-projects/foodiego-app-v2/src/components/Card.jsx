import React, { useContext, useMemo, useState } from 'react'
import { assestData } from '../assets/assets.js'
import { useNavigate } from 'react-router-dom'
import { CartContext } from '../context/CartContext.js'
import { Search, SearchX } from 'lucide-react'

const Card = () => {

    const images = [
        "sandwich.webp",
        "newPizza.webp",
        "burger.webp",
    ]
    const duplicatedImages = [...images, ...images]
     
    const navigate = useNavigate();
    const gotoCardview = (id) => {
        navigate(`/cardview/${id}`)
    }

    const { addToCart, searchQuery, setSearchQuery } = useContext(CartContext);
    const categories = ["all", "pizza", "burger", "sandwich"]
    const [category, setCategory] = useState("all");

    // Handle category change
    const handleCategory = (category) => {
        setCategory(category);
    };

    // Final filtered data using useMemo
    const filteredData = useMemo(() => {
        // 1. Filter by Category
        const categoryFiltered = category === "all"
        ? assestData
        : assestData.filter((item) => item.tag === category);
        
        // converting the searchquery into lowercase
        const lowerCaseSearchQuery = searchQuery.toLowerCase().trim();

        // 2. Filter by Search Query
        const finalFiltered = categoryFiltered.filter((item) => 
            item.title.toLowerCase().includes(lowerCaseSearchQuery)
        );
        
        return finalFiltered;
        
    }, [category, searchQuery, assestData]); // Recalculate only when these dependencies change


  return (
    <div className='flex flex-col items-center justify-center'>

        <div className='w-[87%]'>
            <div className="relative w-full overflow-hidden py-4">
                {/* Carousel Track */}
                <div className="flex animate-infinite-scroll whitespace-nowrap">
                    {duplicatedImages.map((img, index) => (
                    <div key={index} className="flex px-2 lg:px-4">
                        <img
                        src={img}
                        loading='lazy'
                        alt={`Slide ${index}`}
                        className="object-contain rounded-lg"
                        />
                    </div>
                    ))}
                </div>
            </div>
        </div>

        {/* Searchbar component */}
        <div className="mt-10 w-full max-w-md mx-auto md:mx-0">
            <div className="flex items-center rounded-xl overflow-hidden bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 shadow-sm focus-within:shadow-md transition">
                <input
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    type="text"
                    placeholder="Search your food..."
                    className="flex-1 px-4 py-3 text-sm md:text-base bg-transparent outline-none text-gray-800 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500"
                />

                <button className="cursor-pointer px-4 py-3 bg-amber-500 hover:bg-amber-600 transition flex items-center justify-center">
                    <Search className="w-5 h-5 md:h-6 text-white" />
                </button>
            </div>
        </div>

        <div className="w-full flex items-center justify-around mt-10 md:mt-20 mb-10">
            <h1 className="hidden md:block text-2xl font-extrabold dark:text-white"> Menu </h1>

            <div className="flex gap-4 px-2 overflow-x-auto scrollbar-hide md:justify-center">
                {categories.map((item) => (
                    <button
                        key={item}
                        onClick={() => handleCategory(item)}
                        className={`whitespace-nowrap px-5 py-2 rounded-full font-semibold cursor-pointer transition-all duration-200 border ${  category === item ? "bg-amber-500 text-white border-amber-500 shadow-md scale-105" : "bg-white dark:bg-slate-800 text-gray-700 dark:text-gray-200 border-gray-200 dark:border-slate-700 hover:bg-gray-100 dark:hover:bg-slate-700"}`}
                    >
                        {item.charAt(0).toUpperCase() + item.slice(1)}
                    </button>
                ))}
            </div>
        </div>

        <div className='flex flex-wrap justify-center items-center text-left max-w-[95%] sm:max-w-none sm:px-10 py-5 gap-5'>
           
            {filteredData.length < 1 ? <h1 className='text-xl flex flex-col items-center gap-2 font-semibold dark:text-white'><SearchX className='h-12 w-12 text-amber-400'/>Product Not Found</h1> : filteredData.map((item) => (
                <div
                    key={item.id}
                    className="group relative w-80 rounded-3xl overflow-hidden bg-gray-100 dark:bg-black dark:text-white shadow-md hover:shadow-xl transition-all duration-300"
                >
                    <div className="relative overflow-hidden">
                        <img
                        src={item.image}
                        alt={item.title}
                        onClick={() => gotoCardview?.(item.id)}
                        className="h-48 w-full object-cover cursor-pointer
                        group-hover:scale-105 transition-transform duration-500"
                        />

                        {item.tag && ( <span className="absolute top-3 right-3 bg-yellow-400 text-black text-xs font-bold px-3 py-1 rounded-full shadow"> {item.tag} </span>)}
                    </div>

                    <div className="p-5 flex flex-col gap-2">
                        <h1 className="text-xl font-bold tracking-tight line-clamp-1"> {item.title} </h1>

                        <div className="flex items-center gap-1 text-sm">
                            <span className="text-yellow-500 font-semibold">⭐ {item.ratings.toFixed(1)}</span>
                            <span className="text-gray-600 dark:text-gray-400">({item.ratingUsers})</span>
                        </div>

                        <p className="text-2xl font-extrabold mt-1">₹{item.price}</p>
                    </div>

                    <div className="px-5 pb-5">
                        <button
                            onClick={() => addToCart(item)}
                            className="w-full flex items-center justify-center gap-2 bg-black dark:bg-white text-white dark:text-black rounded-xl py-2 font-semibold hover:scale-[1.02] active:scale-95 transition cursor-pointer"
                        >
                            <span className="text-lg">+</span>
                            <span>Add to cart</span>
                        </button>
                    </div>
                </div>

            ))}
        </div>

    </div>
  )
}

export default Card