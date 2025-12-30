import React, { useContext, useState } from 'react'
import { assestData } from '../assets/assets.js'
import { useNavigate, useParams } from 'react-router-dom'
import { CartContext } from '../context/CartContext.js'
import { ArrowLeft } from 'lucide-react'

const Cardview = () => {
  const { id } = useParams(); // get id from URL
  const product = assestData.find((item) => item.id === parseInt(id));

  // set first image as default
  const [selectedImage, setSelectedImage] = useState(product.imagesList[0]);
  if (!product) return <h2>Product not found</h2>

  const navigate = useNavigate()
  
  const {addToCart} = useContext(CartContext);
  // console.log(product.image)

  return (
    <div>
      <div className='mt-10'>
        <button onClick={() => navigate(-1)} className='dark:text-white hover:text-yellow-500 absolute left-[10.5%] cursor-pointer'>
          <ArrowLeft className='w-8 h-6'/>
        </button>
      </div>

      <div className="dark:text-white flex lg:flex-row flex-col max-w-screen p-10 justify-around items-center">
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

        <div className="group relative bg-white/90 dark:bg-slate-900/80 rounded-2xl p-6 flex flex-col gap-4 justify-between backdrop-blur-xl w-[300px] lg:w-[400px] border border-slate-200/60 dark:border-slate-700/60 shadow-lg shadow-slate-200/40 dark:shadow-black/30 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">

          {/* <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-orange-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div> */}

          <div className="relative z-10 flex flex-col gap-2">
            <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white line-clamp-1">
              {product.title}
            </h1>

            <p className="text-sm text-slate-600 dark:text-slate-300 line-clamp-2">
              {product.description}
            </p>

            <div className="flex items-center gap-2 text-sm mt-1">
              <span className="flex items-center gap-1 font-semibold text-yellow-500">
                ⭐ {(product.ratings).toFixed(1)}
              </span>
              <span className="text-slate-500 dark:text-slate-400">
                ({product.ratingUsers})
              </span>
            </div>
          </div>

          <div className="relative z-10 flex items-center justify-between mt-4">
            <p className="text-2xl font-extrabold text-slate-900 dark:text-white">
              ₹{product.price}
            </p>

            {product.tag && (
              <span
                className="hidden lg:inline-block bg-yellow-400 text-black
                text-xs font-bold px-3 py-1 rounded-full"
              >
                {product.tag}
              </span>
            )}
          </div>

          <button
            onClick={() => addToCart(product)}
            className="relative z-10 mt-3 flex items-center justify-center gap-2 bg-black dark:bg-white text-white dark:text-black font-semibold rounded-xl px-4 py-2 hover:scale-[1.03] active:scale-95 transition-transform duration-200 cursor-pointer"
          >
            <span className="text-lg">+</span>
            <span>Add to cart</span>
          </button>
        </div>

      </div>
    </div>
  )
}

export default Cardview