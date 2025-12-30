import { Clock, Mail, MapPin, Phone } from 'lucide-react'
import React, { useState } from 'react'
import { toast } from 'react-toastify'

const ContactUs = () => {

    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [subject, setSubject] = useState('')
    const [message, setMessage] = useState('')

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!name || !email || !subject || !message) {
            toast.error("All fields are required!");
            return 
        }

        const submittedData = { name, email, subject, message };
        console.log("Form submitted:", submittedData);

        // Resetting the form
        setName('');
        setEmail('');
        setSubject('');
        setMessage('');

        toast.success("Message sent Successfully!");
    }

  return (
    <div className='text-black dark:text-white w-[100%] h-full px-10 flex flex-col items-center bg-gradient-to-t from-white dark:from-gray-950 via-white dark:via-gray-950 to-yellow-700/15'>
        <div className='flex flex-col items-center lg:w-[45%] text-center gap-5 mt-20 mb-20'>
            <h1 className='text-5xl md:text-6xl font-bold'>Contact Us</h1>
            <p className='text-md md:text-xl opacity-75'>Have a question or feedback? We'd love to hear from you. Send us a message and we'll respond as soon as possible.</p>
        </div>

        <div className='flex flex-col gap-10 lg:flex-row justify-between mt-10 sm:w-[80%]'>
            <div className='w-full lg:w-[47%] flex flex-col gap-5'>
                <h1 className='font-bold text-3xl'>Get in Touch</h1>
                <div className='bg-gray-50 dark:bg-gray-900 shadow-md p-5 flex rounded-xl items-center gap-5'>
                    <div className='bg-yellow-500/15 rounded p-2'>
                        <Phone className='text-amber-400 h-7 w-7'/>
                    </div>
                    <div>
                        <h3 className='font-bold'>Phone</h3>
                        <p className='font-semibold hover:text-amber-400 cursor-pointer opacity-60'>+1 (555) 123-457</p>
                    </div>
                </div>
                <div className='bg-gray-50 dark:bg-gray-900 shadow-md p-5 flex rounded-xl items-center gap-5'>
                    <div className='bg-yellow-500/15 rounded p-2'>
                        <Mail className='text-yellow-500 h-7 w-7'/>
                    </div>
                    <div>
                        <h3 className='font-bold'>Email</h3>
                        <p className='font-semibold hover:text-amber-400 cursor-pointer opacity-60'>support@gmail.com</p>
                    </div>
                </div>
                <div className='bg-gray-50 dark:bg-gray-900 shadow-md p-5 flex rounded-xl items-center gap-5'>
                    <div className='bg-yellow-500/15 rounded p-2'>
                        <MapPin className='text-amber-400 h-7 w-7'/>
                    </div>
                    <div>
                        <h3 className='font-bold'>Address</h3>
                        <p className='font-semibold hover:text-amber-400 cursor-pointer opacity-60'>123 Food Street, New York, NY 10001</p>
                    </div>
                </div>
                <div className='bg-gray-50 dark:bg-gray-900 shadow-md p-5 flex rounded-xl items-center gap-5'>
                    <div className='bg-yellow-500/15 rounded p-2'>
                        <Clock className='text-yellow-500 h-7 w-7'/>
                    </div>
                    <div>
                        <h3 className='font-bold'>Hours</h3>
                        <p className='font-semibold hover:text-amber-400 cursor-pointer opacity-60'>Mon-Sun: 9:00 AM - 11:00 PM</p>
                    </div>
                </div>

            </div>

            <div className='w-full lg:w-[47%]'>
                <h1 className='font-bold text-3xl'>Send a Message</h1>
                <div className='mt-5 bg-gray-50 shadow-md dark:bg-gray-900 p-5 rounded-xl'>
                    <form onSubmit={handleSubmit} className='flex flex-col gap-5'>
                        <div className='flex flex-col gap-2'>
                            <label htmlFor="name" className='font-semibold'>Name</label>
                            <input value={name} onChange={e => setName(e.target.value)} type="text" id='name' placeholder='Your Name' className='p-2 border border-gray-600 outline-yellow-500 rounded bg-gray-100 dark:bg-gray-800'/>
                        </div>

                        <div className='flex flex-col gap-2'>
                            <label htmlFor="email" className='font-semibold'>Email</label>
                            <input value={email} onChange={e => setEmail(e.target.value)} type="email" id='email' placeholder='your@gmail.com'className='p-2 border border-gray-600 outline-yellow-500 rounded bg-gray-100 dark:bg-gray-800'/>
                        </div>

                        <div className='flex flex-col gap-2'>
                            <label htmlFor="subject" className='font-semibold'>Subject</label>
                             <input value={subject} onChange={e => setSubject(e.target.value)} type="text" id='subject' placeholder='How can we help?' className='p-2 border border-gray-600 outline-yellow-500 rounded bg-gray-100 dark:bg-gray-800'/>
                        </div>

                        <div className='flex flex-col gap-2'>
                            <label htmlFor="message" className='font-semibold'>Message</label>
                            <textarea value={message} onChange={e => setMessage(e.target.value)} name="message" id="message" placeholder='Tell us about your inquiry?' className='p-2 border border-gray-600 outline-yellow-500 rounded h-30 bg-gray-100 dark:bg-gray-800'></textarea>
                        </div>

                        <button type='submit' className='bg-amber-400 text-black font-semibold cursor-pointer rounded-lg p-2 hover:bg-amber-400/95'>Send Message</button>
                    </form>
                </div>
            </div>
        </div>
    </div>
  )
}

export default ContactUs