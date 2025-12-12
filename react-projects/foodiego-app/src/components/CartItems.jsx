import React, { useContext } from 'react'
import { CartContext } from '../context/CartContext';
import { X } from 'lucide-react';

const CartItems = ({item}) => {

    const { setCartItems, handleRemoveItem} = useContext(CartContext);

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

  return (
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
  )
}

export default CartItems