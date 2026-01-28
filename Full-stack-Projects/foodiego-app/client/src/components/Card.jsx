import React, { useContext, useMemo, useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { CartContext } from '../context/CartContext.js'
import { Loader2, Search, SearchX, ChevronLeft, ChevronRight } from 'lucide-react'
import { AppContext } from '../context/AppContext.jsx'

const CATEGORIES = [
  { id: 'all', name: 'All Items', image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&q=80&w=200' },
  { id: 'burger', name: 'Burgers', image: 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?auto=format&fit=crop&q=80&w=200' },
  { id: 'pizza', name: 'Pizzas', image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&q=80&w=200' },
  { id: 'sandwich', name: 'Sandwiches', image: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&q=80&w=200' },
  { id: 'pasta', name: 'Pasta', image: 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?auto=format&fit=crop&q=80&w=200' },
  { id: 'noodles', name: 'Noodles', image: 'https://images.unsplash.com/photo-1612929633738-8fe44f7ec841?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' },
  { id: 'chowmein', name: 'Chow Mein', image: 'https://images.unsplash.com/photo-1634864572872-a01c21e388d4?q=80&w=1334&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' },
];

const Menus = ({category: activeCategory, setCategory: setActiveCategory}) => {

  return (
    <div className="dark:bg-[#0a0a0a] text-white p-6 md:p-12 font-sans selection:bg-orange-500/30 w-[100%]">
      <div className="max-w-5xl mx-auto">
        
        <div className="relative">
          <div className="flex space-x-4 md:space-x-6 overflow-x-auto scrollbar-hide snap-x snap-mandatory pb-8 pt-2">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className="group relative flex-shrink-0 snap-start focus:outline-none"
              >
                
                <div className={`
                  relative w-[70px] h-[70px] sm:w-[100px] sm:h-[100px] lg:w-[150px] lg:h-[150px] rounded-full overflow-hidden transition-all duration-500 ease-out
                  ${activeCategory === cat.id 
                    ? 'ring-[2px] lg:ring-[4px] ring-orange-500 scale-100' 
                    : 'hover:scale-[1.02] ring-1 ring-white/10 opacity-80 hover:opacity-100'}
                `}>
                  
                  <img 
                    src={cat.image} 
                    alt={cat.name}
                    className="w-full h-full object-cover grayscale-[20%] group-hover:grayscale-0 transition-all duration-700 group-hover:scale-110"
                  />
                  
                  <div className={`
                    absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent transition-opacity duration-500
                    ${activeCategory === cat.id ? 'opacity-90' : 'opacity-70 group-hover:opacity-80'}
                  `} />

                  <div className="absolute bottom-6 left-0 right-0 md:px-4 text-center">
                    <p className={`
                      hidden lg:inline-block text-xs uppercase tracking-widest mb-1 font-bold transition-colors
                      ${activeCategory === cat.id ? 'text-orange-400' : 'text-neutral-400'}
                    `}>
                      Explore
                    </p>
                    <h3 className="text-xs lg:text-xl font-semibold sm:font-bold ">
                      {cat.name}
                    </h3>
                  </div>
                </div>
              </button>
            ))}

            {/* <div className="flex-shrink-0 w-12 h-1" /> */}
          </div>

        </div>
      </div>
    </div>
  );

}


const Card = () => {

    const images = [
        "sandwich.webp",
        "newPizza.webp",
        "burger.webp",
    ]
    const duplicatedImages = [...images, ...images]
     
    const navigate = useNavigate();
    const gotoCardview = (id) => {
        navigate(`/product-view/${id}`)
    }

    const { addToCart, searchQuery, setSearchQuery } = useContext(CartContext);
    const [category, setCategory] = useState("all");
    
    const { productData, loading } = useContext(AppContext);
    const productItems = productData?.items
    

    const filteredData1 = useMemo(() => {
        const categoryFiltered = category === "all"
        ? productItems
        : productItems?.filter((item) => item?.category.toLowerCase() === category);
        
        // converting the searchquery into lowercase
        const lowerCaseSearchQuery = searchQuery.toLowerCase().trim();

        // filter by Search Query
        const finalFiltered = categoryFiltered?.filter((item) => 
            item.name.toLowerCase().includes(lowerCaseSearchQuery)
        );
        
        return finalFiltered;
        
    }, [category, searchQuery, productItems]);


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
                        // loading='lazy'
                        width="400"
                        height="300"
                        fetchPriority="high"
                        alt={`Slide ${index}`}
                        className="object-contain rounded-lg"
                        />
                    </div>
                    ))}
                </div>
            </div>
        </div>

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

        {/* Categories menu */}
        <Menus category={category} setCategory={setCategory}/>

        <div className='flex flex-wrap justify-center items-center text-left max-w-[95%] sm:max-w-8xl sm:px-10 py-5 gap-5'>
           
            {loading && (
                <div className="flex flex-col items-center justify-center py-24 space-y-4">
                    <Loader2 className="w-12 h-12 text-amber-500 animate-spin" />
                    <p className="text-gray-500 animate-pulse font-bold uppercase tracking-widest text-xs">Loading Products...</p>
                </div>
            )}

            {filteredData1?.length < 1 ? <h1 className='text-xl flex flex-col items-center gap-2 font-semibold dark:text-white'><SearchX className='h-12 w-12 text-amber-400'/>Product Not Found</h1> : filteredData1?.map((item) => (
                <div
                    // key={item.id}
                    key={item._id}
                    className="group relative w-80 rounded-3xl overflow-hidden bg-gray-100 dark:bg-black dark:text-white shadow-md hover:shadow-xl transition-all duration-300"
                >
                    <div className="relative overflow-hidden">
                        <img
                            src={item.images[0].url}
                            alt={item.name}
                            onClick={() => gotoCardview?.(item._id)}
                            className="h-48 w-full object-cover cursor-pointer
                            group-hover:scale-105 transition-transform duration-500"
                        />

                        {item.category && ( <span className="absolute top-3 right-3 bg-yellow-400 text-black text-xs font-bold px-3 py-1 rounded-full shadow"> {item.category} </span>)}
                    </div>

                    <div className="p-5 flex flex-col gap-2">
                        <h1 className="text-xl font-bold tracking-tight line-clamp-1"> {item.name} </h1>

                        <div className="flex items-center gap-1 text-sm">
                            {/* <span className="text-yellow-500 font-semibold">⭐ {item.ratings.toFixed(1)}</span> */}
                            <span className="text-yellow-500 font-semibold">⭐ {item.averageRating}</span>
                            <span className="text-gray-600 dark:text-gray-400">({item.ratingUsers})</span>
                        </div>

                        <p className="text-2xl font-extrabold mt-1">₹{item.price}</p>
                    </div>

                    <div className="px-5 pb-5">
                        <button
                            onClick={() => addToCart(item, 1)}
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