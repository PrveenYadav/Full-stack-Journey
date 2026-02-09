import React, { useContext, useState } from 'react';
import { CreditCard, CheckCircle, Truck, ArrowRight } from 'lucide-react';
import { CartContext } from '../context/CartContext.js';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext.jsx';

export const Checkout = () => {

  const { 
    handleCheckout,
    cart,
    paymentMethod,
    setPaymentMethod,
    setSubTab,
    formatPrice
  } = useContext(CartContext);

  const navigate = useNavigate();
  const { userData } = useContext(AppContext);

  const total = cart.reduce((a,c)=>a+(c.price * c.quantity),0);
  const defaultAddr = userData?.addresses?.find(a => a.isDefault) || userData?.addresses?.[0];

  return (
    <div className="pt-28 sm:pt-32 pb-24 px-4 max-w-5xl mx-auto min-h-screen">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">

        <div className="space-y-12">
            <div>
              <h3 className="text-xs font-black uppercase tracking-[0.2em] mb-8 dark:text-white">1. Shipping</h3>
              {defaultAddr ? (
                <div className="p-6 border-2 border-black dark:border-white rounded-2xl relative">
                  <p className="font-bold dark:text-white uppercase tracking-tight text-sm mb-1">{defaultAddr?.type}</p>
                  <p className="text-xs text-zinc-500 font-bold uppercase tracking-widest">{defaultAddr?.street}, {defaultAddr?.city}</p>
                  <button onClick={() => { navigate("/account"); setSubTab("addresses")}} className="cursor-pointer absolute top-6 right-6 text-[10px] font-black uppercase tracking-widest text-zinc-400">Edit</button>
                </div>
              ) :
              
              <div>
                <button
                  onClick={() =>{ navigate("/account"); setSubTab("addresses")}}
                  className="px-10 group flex items-center gap-3 cursor-pointer py-5 bg-zinc-900 text-white dark:bg-white dark:text-black font-black uppercase tracking-widest hover:bg-zinc-200 transition-all rounded-md"
                >
                  Set Address{" "}
                  <ArrowRight
                    size={18}
                    className="group-hover:translate-x-1 transition-transform"
                  />
                </button>
              </div>
              }

            </div>



          <div>
            <h3 className="text-xs font-black uppercase tracking-[0.2em] mb-8 dark:text-white">2. Payment</h3>
            <div className="space-y-4">
              {[{id:'card', label:'Card', icon:CreditCard}, {id:'cod', label:'COD', icon:Truck}].map(method => (
                <div key={method.id} onClick={() => setPaymentMethod(method.id)} className={`p-6 border-2 rounded-2xl cursor-pointer flex justify-between items-center ${paymentMethod === method.id ? 'border-black dark:border-white' : 'border-zinc-100 dark:border-zinc-900'}`}>
                  <div className="flex items-center gap-4">
                    <method.icon size={20} className={paymentMethod === method.id ? 'dark:text-white' : 'text-zinc-400'} />
                    <span className={`text-xs font-black uppercase tracking-widest ${paymentMethod === method.id ? 'dark:text-white' : 'text-zinc-400'}`}>{method.label}</span>
                  </div>
                  {paymentMethod === method.id && <CheckCircle size={18} className="text-black dark:text-white" />}
                </div>
              ))}
            </div>

            {paymentMethod === "card" && (<h1 className='text-black pt-5 px-3 dark:text-gray-300'>Not Available</h1>)}
          </div>
        </div>

        <div>
          <div className="bg-gray-100 dark:bg-zinc-900 dark:text-white p-8 rounded-[2rem] shadow-2xl">
            <h4 className="font-black uppercase tracking-[0.2em] text-[9px] text-zinc-500 mb-10">Summary</h4>
            <div className="space-y-6 mb-10 max-h-60 overflow-y-auto scrollbar-hide">
              {cart.map((item, i) => (
                <div key={i} className="flex justify-between items-center">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-14 bg-white/10 rounded-lg overflow-hidden flex-shrink-0">
                      <img src={item?.image} className="w-full h-full object-cover" />
                    </div>
                    <div><span className="font-black text-[10px] uppercase tracking-tight block">{item.name}</span><span className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest">{item.quantity}x • {item.size}</span></div>
                  </div>
                  <span className="font-black text-xs">{formatPrice(item.price * item.quantity)}</span>
                </div>
              ))}
            </div>
            <div className="h-px bg-white/10 my-10"></div>
            <div className="flex justify-between text-3xl font-black uppercase tracking-tighter mb-10"><span>Total</span><span>{formatPrice(total)}</span></div>
            
            <button 
              disabled={paymentMethod === "card"} 
              onClick={() => { handleCheckout(); navigate("/account"); setSubTab("orders")}} 
              // onClick={handleCheckout} 
              className="cursor-pointer w-full py-6 bg-zinc-900 dark:bg-white text-white dark:text-black font-black uppercase tracking-widest rounded-2xl text-xs disabled:bg-zinc-400 dark:disabled:bg-zinc-400 disabled:text-zinc-700 disabled:cursor-not-allowed disabled:opacity-20"
            >
              Place Order
            </button>

          </div>
        </div>

      </div>
    </div>
  );
};