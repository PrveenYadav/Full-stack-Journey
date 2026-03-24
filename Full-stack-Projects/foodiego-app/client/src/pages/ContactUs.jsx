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
            return;
        }

        // console.log({ name, email, subject, message });

        setName('');
        setEmail('');
        setSubject('');
        setMessage('');

        toast.success("Message sent successfully!");
    }

    return (
        <div className='w-full min-h-screen px-4 sm:px-6 lg:px-16 py-16 flex flex-col items-center gap-16 
        bg-white dark:bg-zinc-950 text-zinc-800 dark:text-zinc-100'>

            <div className='max-w-3xl text-center flex flex-col gap-4'>
                <h1 className='text-4xl sm:text-5xl lg:text-6xl font-extrabold'>
                    Contact <span className='text-orange-500'>Us</span>
                </h1>
                <p className='text-sm sm:text-base lg:text-lg opacity-70'>
                    Have a question or feedback? We'd love to hear from you.
                </p>
            </div>

            <div className='w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-8'>

                <div className='flex flex-col gap-5'>
                    <h2 className='text-2xl font-bold'>Get in Touch</h2>

                    {[
                        { icon: Phone, title: "Phone", value: "+1 (555) 123-457" },
                        { icon: Mail, title: "Email", value: "support@gmail.com" },
                        { icon: MapPin, title: "Address", value: "123 Food Street, NY" },
                        { icon: Clock, title: "Hours", value: "Mon-Sun: 9AM - 11PM" }
                    ].map((item, i) => (
                        <div
                            key={i}
                            className='flex items-center gap-4 p-4 rounded-xl 
                            border border-zinc-200 dark:border-zinc-800 
                            bg-zinc-50 dark:bg-zinc-900 
                            hover:shadow-md transition'
                        >
                            <div className='bg-orange-500/10 p-2 rounded-lg'>
                                <item.icon className='text-orange-500 w-5 h-5'/>
                            </div>

                            <div>
                                <h3 className='font-semibold'>{item.title}</h3>
                                <p className='text-sm opacity-60'>{item.value}</p>
                            </div>
                        </div>
                    ))}
                </div>

                <div>
                    <h2 className='text-2xl font-bold mb-4'>Send a Message</h2>

                    <div className='p-6 rounded-xl border border-zinc-200 dark:border-zinc-800 
                    bg-zinc-50 dark:bg-zinc-900 shadow-sm'>

                        <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
                            <div>
                                <label className='text-sm font-medium'>Name</label>
                                <input
                                    value={name}
                                    onChange={e => setName(e.target.value)}
                                    type="text"
                                    placeholder='Your name'
                                    className='mt-1 w-full p-2.5 rounded-lg 
                                    bg-white dark:bg-zinc-800 
                                    border border-zinc-300 dark:border-zinc-700 
                                    focus:outline-none focus:ring-2 focus:ring-orange-500'
                                />
                            </div>

                            <div>
                                <label className='text-sm font-medium'>Email</label>
                                <input
                                    value={email}
                                    onChange={e => setEmail(e.target.value)}
                                    type="email"
                                    placeholder='your@email.com'
                                    className='mt-1 w-full p-2.5 rounded-lg 
                                    bg-white dark:bg-zinc-800 
                                    border border-zinc-300 dark:border-zinc-700 
                                    focus:outline-none focus:ring-2 focus:ring-orange-500'
                                />
                            </div>

                            <div>
                                <label className='text-sm font-medium'>Subject</label>
                                <input
                                    value={subject}
                                    onChange={e => setSubject(e.target.value)}
                                    type="text"
                                    placeholder='How can we help?'
                                    className='mt-1 w-full p-2.5 rounded-lg 
                                    bg-white dark:bg-zinc-800 
                                    border border-zinc-300 dark:border-zinc-700 
                                    focus:outline-none focus:ring-2 focus:ring-orange-500'
                                />
                            </div>

                            <div>
                                <label className='text-sm font-medium'>Message</label>
                                <textarea
                                    value={message}
                                    onChange={e => setMessage(e.target.value)}
                                    placeholder='Write your message...'
                                    className='mt-1 w-full p-2.5 h-28 rounded-lg 
                                    bg-white dark:bg-zinc-800 
                                    border border-zinc-300 dark:border-zinc-700 
                                    focus:outline-none focus:ring-2 focus:ring-orange-500'
                                />
                            </div>

                            <button
                                type='submit'
                                className='mt-2 bg-orange-500 hover:bg-orange-600 
                                text-white font-semibold py-2.5 rounded-lg 
                                transition duration-200 cursor-pointer'
                            >
                                Send Message
                            </button>

                        </form>
                    </div>
                </div>

            </div>
        </div>
    )
}

export default ContactUs