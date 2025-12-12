import React, { useContext, useState } from 'react'
import { CartContext } from '../context/CartContext.js';
import { X } from 'lucide-react'
import { toast } from 'react-toastify';

const PlaceOrder = ({setIsPlaceOrderOpen, total}) => {

    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [phoneNumber, setPhoneNumber] = useState('')
    const [address, setAddress] = useState('')

    const { setCartItems } = useContext(CartContext);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!name || !email || !phoneNumber || !address) {
            toast.error("All fields are required!");
            return 
        }

        const submittedData = { name, email, phoneNumber, address };
        console.log("Form submitted:", submittedData);

        // Resetting the form
        setName('');
        setEmail('');
        setPhoneNumber('');
        setAddress('');

        // closing the form and toast message
        setIsPlaceOrderOpen(false);
        toast.success("Order Placed Successfully!");
        setCartItems([]);
    }

  return (
    <div className='fixed inset-0 z-50 top-0 right[50%] text-black dark:text-white w-[100%] h-full px-10 flex flex-col justify-center items-center bg-gradient-to-t from-white dark:from-gray-900 via-white dark:via-gray-900 to-yellow-700/15 backdrop-blur-xs'>

        <div className='w-screen sm:w-[70%] md:w-[60%] lg:[47%] xl:w-[40%] 2xl:w-[30%]'>

            <div className='mt-5 bg-gray-50 shadow-md dark:bg-gray-800 p-5 rounded-xl'>
                <div className='flex justify-between mb-5'>
                    <h1 className='font-bold text-2xl'>CheckOut</h1>
                    <button onClick={() => setIsPlaceOrderOpen(false)}>
                        <X className="w-6 h-6 text-gray-600 dark:text-gray-300 cursor-pointer hover:text-amber-500 transition-all ease-in duration-200" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className='flex flex-col gap-5 text-start'>
                    <div className='flex flex-col gap-2'>
                        <label htmlFor="name">Full Name</label>
                        <input value={name} onChange={e => setName(e.target.value)} type="text" id='name' placeholder='John Doe' className='p-2 border border-gray-600 outline-yellow-500 rounded bg-gray-100 dark:bg-gray-900'/>
                    </div>

                    <div className='flex flex-col gap-2'>
                        <label htmlFor="email">Email</label>
                        <input value={email} onChange={e => setEmail(e.target.value)} type="email" id='email' placeholder='john@example.com'className='p-2 border border-gray-600 outline-yellow-500 rounded bg-gray-100 dark:bg-gray-900'/>
                    </div>

                    <div className='flex flex-col gap-2'>
                        <label htmlFor="subject">Phone Number</label>
                            <input value={phoneNumber} onChange={e => setPhoneNumber(e.target.value)} type="text" id='subject' placeholder='(555) 123-4567' className='p-2 border border-gray-600 outline-yellow-500 rounded bg-gray-100 dark:bg-gray-900'/>
                    </div>

                    <div className='flex flex-col gap-2'>
                        <label htmlFor="address">Delivery Address</label>
                        <textarea value={address} onChange={e => setAddress(e.target.value)} name="address" id="address" placeholder='123, Main St, Apt 4B, New York, NY 10001' className='p-2 border border-gray-600 outline-yellow-500 rounded h-20 bg-gray-100 dark:bg-gray-900'></textarea>
                    </div>

                    <p className='border opacity-10 w-full'></p>
                    <div className='flex justify-between'>
                      <h1 className='font-bold text-xl'>Total Amount</h1>
                      <p className='font-bold text-2xl text-amber-500'>${total.toFixed(2)}</p>
                    </div>

                    <button type='submit' className='bg-yellow-500 text-black font-semibold cursor-pointer rounded p-2'>Place Order</button>
                </form>
            </div>
        </div>
    </div>
  )
}

export default PlaceOrder