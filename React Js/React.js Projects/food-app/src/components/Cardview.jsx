import React, { useContext, useState } from 'react'
import { assestData } from '../assets/assets.js'
import { useNavigate, useParams } from 'react-router-dom'
import { CartContext } from '../context/CartContext.js'

const Cardview = () => {
  const { id } = useParams(); // get id from URL
  const product = assestData.find((item) => item.id === parseInt(id));

  // set first image as default
  const [selectedImage, setSelectedImage] = useState(product.imagesList[0]);
  if (!product) return <h2>Product not found</h2>;

  const navigate = useNavigate()

  const {addToCart} = useContext(CartContext);
  // console.log(product.image)


  return (
    <div className='h-[100vh] 2xl:h-[90vh] '>
      <button onClick={() => navigate(-1)} className='dark:text-white absolute left-[10.5%] text-5xl font-bold mt-2 mb-2 cursor-pointer'>←</button>
      <div className="dark:text-white flex lg:flex-row flex-col md:h-[90vh] max-w-screen p-10 pb-0 items-center justify-around">
        {/* Product images */}
        <div className="p-6 flex flex-col items-center">
          {/* Main Image */}
          <div className="w-[300px] h-[300px] lg:w-[400px] lg:h-[400px] border rounded-lg shadow-md mb-4">
            <img
              src={selectedImage}
              alt={product.title}
              className="w-full h-full object-contain"
            />
          </div>

          {/* Thumbnails */}
          <div className="flex gap-3 mb-6">
            {product.imagesList.map((img, index) => (
              <img
                key={index}
                src={img}
                alt={`thumb-${index}`}
                className={`w-15 lg:w-20 h-15 lg:h-20 object-cover rounded-md border cursor-pointer ${
                  selectedImage === img ? "border-blue-500" : "border-gray-300"
                }`}
                onClick={() => setSelectedImage(img)}
              />
            ))}
          </div>

        </div>

        {/* Details */}
        <div className='flex border flex-col gap-3 justify-center p-5 backdrop-blur-xl rounded-2xl w-[300px] lg:w-[400px]'>
          <div className='gap-2 flex flex-col'>
              <h1 className='text-xl font-bold'>{product.title}</h1>
              <p>{product.description}</p>
              <p>{product.ratings}<span> {product.ratingUsers} </span></p>
              <p className='font-bold text-2xl'>{product.price}</p>
          </div>
          <p className='bg-yellow-200 px-3 border-white dark:text-black rounded-xl w-fit hidden lg:inline-block'>{product.tag}</p>
          <button onClick={() => addToCart(product)} className='bg-black dark:bg-white text-white dark:text-black mb-5 rounded-xl font-semibold cursor-pointer px-2 py-1 w-[150px] lg:w-[150px]'>+<span className='ml-5'>Add to cart</span></button>
        </div>

      </div>
    </div>
  )
}

export default Cardview