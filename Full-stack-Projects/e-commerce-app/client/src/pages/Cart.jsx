import React, { useContext } from 'react';
import { ShoppingBag, Trash2 } from 'lucide-react';
import { CartContext } from '../context/CartContext.js';
import { useNavigate } from 'react-router-dom';


export const Cart = () => {

  const { 
    removeFromCart,
    cart,
    setCart,
    formatPrice
  } = useContext(CartContext);

  const navigate = useNavigate();
  const total = cart.reduce((acc, curr) => acc + (curr.price * curr.quantity), 0);

  return (
    <div className="pt-28 sm:pt-32 pb-24 px-4 max-w-7xl mx-auto min-h-screen">
      <h2 className="text-4xl sm:text-6xl font-black text-zinc-900 dark:text-white tracking-tighter mb-10 uppercase leading-none">Bag</h2>
      {cart?.length === 0 ? (
        <div className="py-24 text-center">
          <ShoppingBag size={64} className="mx-auto text-zinc-200 mb-8" />
          <p className="text-zinc-500 font-bold mb-8 uppercase tracking-widest text-sm">Your shopping bag is empty.</p>
          <button onClick={() => navigate('/shop')} className="cursor-pointer px-10 py-5 bg-black dark:bg-white text-white dark:text-black font-black uppercase tracking-widest rounded-xl transition-transform hover:scale-105">Start Shopping</button>
        </div>

      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          <div className="lg:col-span-8 space-y-10">
            {cart?.map((item, idx) => (
              <div key={idx} className="flex gap-4 pb-10 border-b border-zinc-100 dark:border-zinc-900 group">
                <div className="w-24 h-32 rounded-2xl overflow-hidden bg-zinc-100 dark:bg-zinc-800 flex-shrink-0">
                  {/* <img src={item?.images?.[0]?.url} className="w-full h-full object-cover" /> */}
                  <img src={item?.image} className="w-full h-full object-cover" />
                </div>
                <div className="flex-grow flex flex-col justify-between">
                  <div className="flex justify-between">
                    <div>
                      <h3 className="text-base font-black dark:text-white uppercase tracking-tight">{item.name}</h3>
                      <p className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest mt-1">{item.size} / {item.color}</p>
                    </div>
                    <p className="text-sm font-black dark:text-white">{formatPrice(item.price)}</p>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center bg-zinc-100 dark:bg-zinc-900 rounded-xl p-1">
                      <button className="cursor-pointer w-8 h-8 flex items-center justify-center dark:text-white font-black" onClick={() => {
                        if (item.quantity > 1) {
                          const newCart = [...cart];
                          newCart[idx].quantity -= 1;
                          setCart(newCart);
                        } else removeFromCart(idx);
                      }}>-</button>
                      <span className="w-8 text-center font-black dark:text-white text-xs">{item.quantity}</span>
                      <button className="cursor-pointer w-8 h-8 flex items-center justify-center dark:text-white font-black" onClick={() => {
                        const newCart = [...cart];
                        newCart[idx].quantity += 1;
                        setCart(newCart);
                      }}>+</button>
                    </div>
                    <button onClick={() => removeFromCart(idx)} className="cursor-pointer text-zinc-300 hover:text-rose-500 p-2"><Trash2 size={20} /></button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="lg:col-span-4">
            <div className="bg-zinc-50 dark:bg-zinc-900 p-8 rounded-3xl sticky top-32">
              <div className="space-y-6 mb-10">
                <div className="flex justify-between font-bold dark:text-white text-xs uppercase tracking-widest"><span>Subtotal</span><span>{formatPrice(total)}</span></div>
                <div className="flex justify-between text-2xl font-black dark:text-white uppercase tracking-tighter"><span>Total</span><span>{formatPrice(total)}</span></div>
              </div>
              <button onClick={() => navigate('/checkout')} className="cursor-pointer w-full py-6 bg-black dark:bg-white text-white dark:text-black font-black uppercase tracking-widest rounded-2xl shadow-xl text-xs">Checkout</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};