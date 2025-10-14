import React, { useContext } from 'react'
import { X, ShoppingBag, XCircle } from 'lucide-react'
import { CartContext } from '../context/CartContext.js'
import { useState } from 'react';
import PlaceOrder from './PlaceOrder.jsx';

const Cart = ({isCartOpen, setIsCartOpen}) => {

  const [isPlaceOrderOpen, setIsPlaceOrderOpen] = useState(false);

  const { cartItems, setCartItems, handleRemoveItem } = useContext(CartContext);

  // This function prevents the click event from bubbling up to the overlay
  const handleCartClick = (e) => {
    e.stopPropagation(); 
  };

  // cart items count/items-number increasing and decreasing
  const handleIncrease = (id) => {
    setCartItems(prevCart =>
      prevCart.map(item =>
        item.id === id
          ? { ...item, quantity: (item.quantity || 1) + 1 }
          : item
      )
    );
  };

  const handleDecrease = (id) => {
    setCartItems(prevCart =>
      prevCart.map(item =>
        item.id === id
          ? { ...item, quantity: Math.max((item.quantity || 1) - 1, 1) }
          : item
      )
    );
  };

  // price calculations
  const subtotal = cartItems.reduce((total, item) => {
    const price = item.price
    const newPrice = parseFloat(price.slice(1)) || 0; // slicing because you stored the price in the like this "$12.99", so slicing the $ sign and then convreting it into number
    const quantity = item.quantity || 1;
    // console.log(typeof(newPrice), newPrice)
    return total + newPrice * quantity;
  }, 0);

  const deliveryFee = 5.00
  const total = subtotal + deliveryFee;

  return (
    <div 
      onClick={handleCartClick} 
      className={`fixed top-0 right-0 w-full sm:w-[70%] md:w-[50%] lg:w-[35%] xl:w-[25%] h-[100%] bg-white overflow-auto scrollbar-hide dark:bg-gray-800 shadow-lg`} 
    >
        <div className="pb-10 sticky top-0 bg-white flex justify-between items-center dark:bg-gray-800 p-5 border-b border-black/10 dark:border-white/10">
          <div className='flex gap-3 items-center'>
            <ShoppingBag className="w-6 h-7" />
            <h2 className="text-2xl font-bold">Your Cart</h2>
          </div>
          <button onClick={() => setIsCartOpen(false)}>
            <X className="w-6 h-6 text-gray-600 dark:text-gray-300 cursor-pointer hover:text-amber-500 transition-all ease-in duration-200" />
          </button>
        </div>

        {/* Cart Items */}
        <div className="p-4 space-y-3">
          {/* maping the cart items*/}
            {cartItems.length === 0 ? (
                <div className='flex flex-col items-center mt-50 gap-2'>
                  <ShoppingBag className="h-15 w-15" />
                  <p className='font-bold text-xl'>Your cart is empty</p>
                  <p className='opacity-60'>Add some delicious items to get started!</p>
                  <button onClick={() => setIsCartOpen(false)} className='bg-yellow-400 mt-3 p-2 rounded text-black font-semibold cursor-pointer'>Start Shopping</button>
                  {/* <p className="text-gray-600 dark:text-gray-300">No items yet 🛒</p> */}
                </div>
            ) : (
                <div>
                 <ul className="space-y-2">
                  {cartItems.map((item, index) => (
                      <li key={index}>
                        <div className="p-2 flex gap-5 justify-between">
                          <div className='flex gap-5'>
                            <img className='rounded w-15 h-15 lg:w-25 lg:h-20' src={item.image && `../${item.image}`} alt="img" />
                            <div className='flex flex-col items-start'>
                              <h2 className='font-semibold text-md'>{item.title}</h2>
                              <p className='font-semibold text-md text-amber-400'>{item.price}</p>
                              <div className='flex gap-5 text-center justify-center items-center'>
                                <button onClick={() => handleDecrease(item.id)} className='rounded hover:text-amber-400 px-2 py-1 text-2xl cursor-pointer'>–</button>
                                <p className='font-bold text-md'>{item.quantity || 1}</p>
                                <button onClick={() => handleIncrease(item.id)} className='rounded hover:text-amber-400 px-2 py-1 text-2xl cursor-pointer'>+</button>
                              </div>
                            </div>
                          </div>
                          <button onClick={() => handleRemoveItem(item.id)}><X className='h-5 w-5 text-red-500 hover:text-red-600 font-bold cursor-pointer'/></button>
                        </div>
                        <p className='border border-gray-100 dark:border-gray-700 w-full'></p>
                      </li>
                  ))}
                  </ul>

                  <div className='flex flex-col gap-2 sticky bottom-0 pb-3 bg-white dark:bg-gray-800 pt-10'>
                    <p className='border opacity-10 w-full'></p>
                    <div className='flex justify-between'>
                      <p className='opacity-70'>Subtotal</p>
                      <p>${subtotal.toFixed(2)}</p>
                    </div>
                    <div className='flex justify-between'>
                      <p className='opacity-70'>Delivery fee</p>
                      <p>${deliveryFee.toFixed(2)}</p>
                    </div>
                    <p className='border opacity-10 w-full'></p>
                    <div className='flex justify-between'>
                      <h1 className='font-bold text-2xl'>Total</h1>
                      <p className='font-bold text-xl'>${total.toFixed(2)}</p>
                    </div>
                    <button onClick={() => {setIsPlaceOrderOpen(true);}} className='font-semibold bg-amber-400 text-black hover:text-black/80 p-2 rounded w-full cursor-pointer'>Proceed to Checkout</button>
                  </div>

                </div>
            )}
        </div>

        <div className={`${isPlaceOrderOpen ? 'inline-block' : 'hidden'}`}>
          <PlaceOrder setIsPlaceOrderOpen={setIsPlaceOrderOpen} total={total}/>
        </div>
        
    </div>

  )
}

export default Cart