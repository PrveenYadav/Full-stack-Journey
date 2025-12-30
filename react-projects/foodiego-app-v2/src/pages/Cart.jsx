import { useContext, useState } from "react";
import { CartContext } from "../context/CartContext.js";
import { useNavigate } from "react-router-dom";
import CheckoutPage from "./Checkout.jsx";
import { ShoppingBag, ShoppingCart } from "lucide-react";
import { toast } from "react-toastify";

export default function Cart() {

    const { cartItems, setCartItems } = useContext(CartContext);
    const [ischekoutOpen, setIschekoutOpen] = useState(false)


  const updateQty = (id, delta) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, quantity: Math.max(1, item.quantity + delta) }
          : item
      )
    );
  };

  const removeItem = (id) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const navigate = useNavigate()

  const handleClick = () => {
    if (cartItems.length !== 0) {
      setIschekoutOpen(true)
    } else {
      toast.error("Your cart is empty")
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-slate-950 text-gray-900 dark:text-gray-100 transition-colors">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* <h1 className="text-3xl font-bold mb-6">Shopping Cart</h1> */}
        <div className='flex gap-3 items-center mb-5 px-2'>
          <ShoppingBag className="w-6 h-7" />
          <h2 className="text-2xl font-bold">Your Cart</h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            {cartItems.length === 0 ? (
              <div className="bg-white dark:bg-slate-800 rounded-xl p-6 text-center flex flex-col items-center gap-2">
                <ShoppingCart className="h-15 w-15" />
                <p className='font-bold text-xl'>Your cart is empty</p>
                <p className='opacity-60'>Add some delicious items to get started!</p>
                <button onClick={() => navigate('/')} className='bg-yellow-400 hover:bg-amber-400/95 mt-3 p-2 rounded-md text-black font-semibold cursor-pointer'>Start Shopping</button>
              </div>
            ) : (
              cartItems.map((item) => (
                <div
                  key={item.id}
                  className="flex flex-col sm:flex-row gap-4 bg-white dark:bg-slate-900 rounded-xl p-4 shadow"
                >
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full sm:w-28 h-28 object-cover rounded-lg"
                  />

                  <div className="flex-1">
                    <h2 className="font-semibold text-lg">{item.title}</h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      ₹{item.price.toLocaleString()}
                    </p>

                    <div className="flex items-center gap-3 mt-3">
                      <button
                        onClick={() => updateQty(item.id, -1)}
                        className="px-3 py-1 rounded bg-gray-200 dark:bg-slate-800 hover:bg-gray-300 dark:hover:bg-slate-700 cursor-pointer"
                      >
                        −
                      </button>
                      <span className="min-w-[24px] text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQty(item.id, 1)}
                        className="px-3 py-1 rounded bg-gray-200 dark:bg-slate-800 hover:bg-gray-300 dark:hover:bg-slate-700 cursor-pointer"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <div className="flex sm:flex-col justify-between items-end">
                    <p className="font-semibold">
                      ₹{(item.price * item.quantity).toLocaleString()}
                    </p>
                    <button
                      onClick={() => removeItem(item.id)}
                      className="text-red-500 hover:underline text-sm cursor-pointer"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-xl p-6 shadow h-fit">
            <h2 className="text-xl font-semibold mb-4">Order Summary</h2>

            <div className="flex justify-between mb-2">
              <span>Subtotal</span>
              <span>₹{subtotal.toLocaleString()}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span>Shipping</span>
              <span className="text-green-600">Free</span>
            </div>
            <div className="border-t border-gray-200 dark:border-slate-700 my-3" />
            <div className="flex justify-between font-bold text-lg">
              <span>Total</span>
              <span>₹{subtotal.toLocaleString()}</span>
            </div>

            <button onClick={handleClick} className="w-full mt-5 py-3 rounded-lg bg-amber-400 hover:bg-amber-400/95 text-black hover:text-black/80 font-semibold cursor-pointer">
              Proceed to Checkout
            </button>
          </div>
        </div>
      </div>
    
      { ischekoutOpen ? <CheckoutPage total={subtotal} subtotal={subtotal}/> : ''}
    </div>
  );
}