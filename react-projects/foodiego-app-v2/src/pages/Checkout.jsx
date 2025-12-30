import { useContext, useState } from "react";
import { CartContext } from "../context/CartContext.js";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function CheckoutPage({total, subtotal}) {
    const [paymentMethod, setPaymentMethod] = useState("card");
    
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [phoneNumber, setPhoneNumber] = useState('')
    const [address, setAddress] = useState('')
    const [city, setCity] = useState('')
    const [state, setState] = useState('')
    const [pincode, setPincode] = useState('')

    const [cvvNumber, setCvvNumber] = useState('')
    const [cardNumber, setCardNumber] = useState('')
    const [cardDate, setCardDate] = useState('')

    const { setCartItems } = useContext(CartContext);
    const navigate = useNavigate()

    const handleClick = () => {
        if (!name || !email || !phoneNumber || !address || !city || !state || !pincode) {
            toast.error("All fields are required!");
            return 
        }

        if (paymentMethod === "card") {
            if (!cvvNumber || !cardDate || !cardNumber) {
                toast.error("Card details are required!");
                return 
            }
        }

        const submittedData = { name, email, phoneNumber, address, city, state, pincode };
        console.log("Form submitted:", submittedData);

        // Resetting the form
        setName('');
        setEmail('');
        setPhoneNumber('');
        setAddress('');
        setCity('');
        setState('');
        setPincode('');

        setCardDate('');
        setCardNumber('');
        setCvvNumber('');

        // closing the form and toast message
        // setIsPlaceOrderOpen(false);
        toast.success("Order Placed Successfully!");
        navigate('/')
        setCartItems([]);
    }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-slate-950 text-gray-900 dark:text-gray-100 transition-colors">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          <div className="lg:col-span-2 space-y-6">

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
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
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
                  <input
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
                  />
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

    </div>
  );
}