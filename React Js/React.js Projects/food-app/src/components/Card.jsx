import React, { useContext } from 'react'
import { assestData } from '../assets/assets.js'
import { useNavigate } from 'react-router-dom'
import { CartContext } from '../context/CartContext.js'

const Card = ({category, handleCategory}) => {

    const images = [
        "sandwich.png",
        "newPizza.png",
        "burger.png",
        // "pizza.png",
        // "pizzaNew.png",
    ]
    const duplicatedImages = [...images, ...images]
     
    const navigate = useNavigate();
    const gotoCardview = (id) => {
        navigate(`/cardview/${id}`)
    }

    const filteredData = category === "all" ? assestData : assestData.filter((item) => item.tag === category);
    const {addToCart} = useContext(CartContext);


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
        
        <div className='flex items-center justify-around w-[87%]'>
            <h1 className='dark:text-white text-2xl hidden md:inline-block font-semibold'>Menu</h1>
            {/* <p>Filter your category</p> */}
            <div className="flex gap-4 mt-10 mb-10">
                <button onClick={() => handleCategory("all")} className="bg-amber-200 font-semibold rounded-2xl cursor-pointer px-3 py-1 shadow-md hover:scale-105">all</button>
                <button onClick={() => handleCategory("pizza")} className="bg-amber-200 font-semibold rounded-2xl cursor-pointer px-3 py-1 shadow-md hover:scale-105">pizza</button>
                <button onClick={() => handleCategory("burger")} className="bg-amber-200 font-semibold rounded-2xl cursor-pointer px-3 py-1 shadow-md hover:scale-105">burger</button>
                <button onClick={() => handleCategory("sandwich")} className="bg-amber-200 font-semibold rounded-2xl cursor-pointer px-3 py-1 shadow-md hover:scale-105">sandwich</button>
                {/* <button onClick={() => handleCategory("chowmin")} className="bg-amber-200 font-semibold rounded-2xl cursor-pointer px-3 py-1 shadow-md hover:scale-105">chow min</button> */}
            </div>
        </div>

        <div className='flex flex-wrap justify-center items-center text-left max-w-[95%] sm:max-w-none sm:px-10 py-5 gap-5'>
            {filteredData.map((item) => (
                <div 
                    key={item.id}
                    // onClick={() => gotoCardview(item.id)} 
                    className='max-h-110 w-80 bg-gray-100 dark:bg-black/20 dark:text-white rounded-2xl hover:shadow-md transition-transform duration-500 hover:scale-101'
                >
                    <img 
                        src={item.image} alt="pizza-1" 
                        key={item.id}
                        onClick={() => gotoCardview(item.id)} 
                        className='rounded-t-lg max-h-[50%] cursor-pointer' 
                    />
                    <div className='p-5 flex flex-col gap-2 text-left justify-center'>
                        <h1 className='text-xl font-bold'>{item.title}</h1>
                        <p>{item.ratings}<span> {item.ratingUsers} </span></p>
                        <p className='font-bold text-2xl'>{item.price}</p>
                        <p className='bg-yellow-200 px-3 dark:bg-green-400 dark:text-black rounded-xl w-fit'>{item.tag}</p>
                    </div>
                    <button onClick={() => addToCart(item)} className='bg-black dark:bg-white text-white dark:text-black ml-3 mb-5 rounded-xl font-semibold cursor-pointer px-2 py-1 w-[90%]'>+<span className='ml-5'>Add to cart</span></button>
                </div>
            ))}
        </div>

    </div>
  )
}

export default Card