import React, { useContext } from 'react'
import { X } from 'lucide-react'
import { CartContext } from '../context/CartContext.js'

const Cart = ({isCartOpen, setIsCartOpen}) => {
  const {cartItems} = useContext(CartContext);

  return (
    <div className={`fixed top-0 right-0 sm:w-[40%] lg:w-[25%] w-[100vw] h-[100%] bg-white overflow-auto scrollbar-hide dark:bg-gray-800 shadow-lg transform transition-transform duration-300 ${ isCartOpen ? "translate-x-0" : "translate-x-full" }`} >

        <div className="flex justify-between items-center p-4 border-b dark:border-gray-700">
          <button onClick={() => setIsCartOpen(false)}>
            <X className="w-6 h-6 text-gray-600 dark:text-gray-300 cursor-pointer" />
          </button>
          <h2 className="text-lg font-bold">Your Cart</h2>
        </div>

        {/* Cart Items */}
        <div className="p-4 space-y-3">
          {/* Later map your cart items here */}
            {cartItems.length === 0 ? (
                <p className="text-gray-600 dark:text-gray-300">No items yet 🛒</p>
            ) : (
                <ul className="space-y-2">
                {cartItems.map((item, index) => (
                    <li key={index} className="border p-2 rounded">
                        <img className='rounded' src={item.image && `../${item.image}`} alt="img" /> - {item.title} - {item.price}
                    </li>
                ))}
                </ul>
            )}
          
        </div>

    </div>
  )
}

export default Cart