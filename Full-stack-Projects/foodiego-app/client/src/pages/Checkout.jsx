import { useContext, useEffect, useState } from "react";
import { CartContext } from "../context/CartContext.js";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import { AppContext } from "../context/AppContext.jsx";

export default function CheckoutPage({total, subtotal}) {
  const [paymentMethod, setPaymentMethod] = useState("card");
    
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [address, setAddress] = useState('')
  const [city, setCity] = useState('')
  const [state, setState] = useState('')
  const [pincode, setPincode] = useState('')
  const [cvvNumber, setCvvNumber] = useState('')
  const [cardNumber, setCardNumber] = useState('')
  const [cardDate, setCardDate] = useState('')

  const { setCartItems, cartItems, setOrderData, orderData } = useContext(CartContext);
  const navigate = useNavigate()

  const formattedItems = cartItems.map(item => ({
    productId: item._id,
    name: item.name,
    price: Number(item.price),
    quantity: item.quantity,
    category: item.category,
    // to get the url of the first image in the array
    image: item.images && item.images.length > 0 ? item.images[0].url : ""
  }));


  const handleClick = () => {
    if (!name || !email || !phone || !address || !city || !state || !pincode) {
      toast.error("All fields are required!");
      return 
    }

    if (paymentMethod === "card") {
      if (!cvvNumber || !cardDate || !cardNumber) {
        toast.error("Card details are required!");
        return 
      }
    }

    const orderInfo = { name, email, phone, address, city, state, pincode };

    const orderPayload = {
      orderInfo: orderInfo,
      items: formattedItems,
      paymentInfo: {
        method: paymentMethod // "cod"
      },
      totals: {
        grandTotal: total
      }
    };
    

    if (createOrder(orderPayload)) {
      // Resetting the form
      setName('');
      setEmail('');
      setPhone('');
      setAddress('');
      setCity('');
      setState('');
      setPincode('');
  
      setCardDate('');
      setCardNumber('');
      setCvvNumber('');
  
      toast.success("Order Placed Successfully!");
      navigate('/')
      setCartItems([]);
    }

  }


  const { backendUrl } = useContext(AppContext)

  const createOrder = async (orderPayload) => {
    axios.defaults.withCredentials = true;

    try {
      const { data } = await axios.post(backendUrl + '/api/order/create', orderPayload)

      if (data.success) {
        toast.success(data.success)
        setOrderData(data)
      } else {
        toast.error(data.messsage)
      }

    } catch (error) {
      console.log(error.messsage || "Error in creating order")
    }
  }


  return (
    <div className="min-h-screen bg-gray-100 dark:bg-slate-950 text-gray-900 dark:text-gray-100 transition-colors">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Section */}
          <div className="lg:col-span-2 space-y-6">
            {/* Shipping Info */}
            <div className="bg-white dark:bg-slate-900 rounded-xl p-6 shadow">
              <h2 className="text-xl font-semibold mb-4">Shipping Information</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Full Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="p-2 border border-gray-600 outline-yellow-500 rounded bg-gray-100 dark:bg-gray-800 text-black dark:text-white"
                />
                <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="p-2 border border-gray-600 outline-yellow-500 rounded bg-gray-100 dark:bg-gray-800 text-black dark:text-white"
                />
                <input
                  type="tel"
                  placeholder="Phone Number"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="p-2 border border-gray-600 outline-yellow-500 rounded bg-gray-100 dark:bg-gray-800 text-black dark:text-white"
                />
                <input 
                    type="text" 
                    placeholder="City" 
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="p-2 border border-gray-600 outline-yellow-500 rounded bg-gray-100 dark:bg-gray-800 text-black dark:text-white" 
                />
                <input
                  type="text"
                  placeholder="Postal Code"
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value)}
                  className="p-2 border border-gray-600 outline-yellow-500 rounded bg-gray-100 dark:bg-gray-800 text-black dark:text-white"
                />
                <input
                  type="text"
                  placeholder="State"
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  className="p-2 border border-gray-600 outline-yellow-500 rounded bg-gray-100 dark:bg-gray-800 text-black dark:text-white"
                />
                <input
                  type="text"
                  placeholder="Address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="sm:col-span-2 p-2 border border-gray-600 outline-yellow-500 rounded bg-gray-100 dark:bg-gray-800 text-black dark:text-white"
                />
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-xl p-6 shadow">
              <h2 className="text-xl font-semibold mb-4">Payment Method</h2>

              <div className="space-y-3">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === "card"}
                    onChange={() => setPaymentMethod("card")}
                  />
                  <span>Credit / Debit Card</span>
                </label>

                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === "cod"}
                    onChange={() => setPaymentMethod("cod")}
                  />
                  <span>Cash on Delivery</span>
                </label>
              </div>

              {paymentMethod === "card" && (
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                  <p className="opacity-60">Unavailable</p>
                  {/* <input
                    type="text"
                    placeholder="Card Number"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    className="input sm:col-span-2 p-2 border border-gray-600 outline-yellow-500 rounded bg-gray-100 dark:bg-gray-800 text-black dark:text-white"
                  />
                  <input
                    type="text"
                    placeholder="MM / YY"
                    value={cardDate}
                    onChange={(e) => setCardDate(e.target.value)}
                    className="input p-2 border border-gray-600 outline-yellow-500 rounded bg-gray-100 dark:bg-gray-800 text-black dark:text-white"
                  />
                  <input 
                    type="text" 
                    placeholder="CVV" 
                    value={cvvNumber}
                    onChange={(e) => setCvvNumber(e.target.value)}
                    className="input p-2 border border-gray-600 outline-yellow-500 rounded bg-gray-100 dark:bg-gray-800 text-black dark:text-white" 
                  /> */}
                </div>
              )}
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-xl p-6 shadow h-fit">
            <h2 className="text-xl font-semibold mb-4">Order Summary</h2>

            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>₹{subtotal || 0}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span className="text-green-600">Free</span>
              </div>
              <div className="flex justify-between">
                <span>Tax</span>
                <span>₹0</span>
              </div>
            </div>

            <div className="border-t border-gray-200 dark:border-slate-700 my-4" />

            <div className="flex justify-between font-bold text-lg">
              <span>Total</span>
              <span>₹{total || 0}</span>
            </div>

            <button type="submit" onClick={handleClick} className="w-full mt-5 py-3 rounded-lg bg-amber-400 hover:bg-amber-400/95 text-black hover:text-black/80 font-semibold cursor-pointer">
              Place Order
            </button>
          </div>
        </div>
      </div>

      {/* Tailwind input helper */}
      <style jsx>{`
        .input {
          @apply w-full px-4 py-2 rounded-lg bg-gray-100 dark:bg-slate-700 border border-gray-300 dark:border-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500;
        }
      `}</style>
    </div>
  );
}