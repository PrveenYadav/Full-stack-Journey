import { Award, Clock, ConciergeBell, Headset, Heart, HeartHandshake, ShieldCheck, Sparkles, Users, } from 'lucide-react'

const About = () => {
  return (
    <div className='text-black dark:text-white w-[100%] h-full px-10 flex flex-col items-center bg-gradient-to-t from-white dark:from-gray-950 via-white dark:via-gray-950 to-yellow-700/15 gap-15'>

        <div className='lg:w-[50%] mt-30 flex flex-col items-center text-center gap-10'>
            <h1 className='text-5xl lg:text-6xl font-bold'>About FoodieGo</h1>
            <p className='text-md lg:text-xl opacity-65'>We're passionate about bringing delicious food from your favorite restaurants straight to your door. Founded in 2020, we've grown to become a trusted name in food delivery.</p>
        </div>

        <div className='lg:w-[50%] mt-10 lg:mt-30 flex flex-col items-center text-center gap-10 mb-10 lg:mb-20'>
            <h1 className='text-4xl font-bold'>Our Mission</h1>
            <p className='text-md lg:text-xl opacity-65'>At FoodieGo, our mission is simple: to connect people with great food. We believe that everyone deserves access to delicious, high-quality meals without the hassle. That's why we partner with the best local restaurants and employ the fastest delivery drivers to ensure your food arrives hot, fresh, and exactly as you ordered it.</p>
        </div>

        <div className='text-center mb-10 lg:mb-20'>
            <h1 className='font-bold text-4xl mb-15'>Why Choose Us</h1>
            <div className='flex flex-wrap lg:flex-row gap-5'>
                <div>
                    <div className='bg-gray-50 dark:bg-gray-900 shadow-md p-5 flex flex-col sm:w-70 lg:w-80 rounded-xl items-center gap-5 text-center'>
                        <div className='bg-yellow-500/15 rounded-full p-3'>
                            <Clock className='text-yellow-500 h-10 w-10'/>
                        </div>
                        <h1 className='font-bold text-2xl'>Fast Delivery</h1>
                        <p className='opacity-60'>Get your food delivered hot and fresh within 30 minutes or less.</p>
                    </div>
                </div>
                <div>
                    <div className='bg-gray-50 dark:bg-gray-900 shadow-md p-5 flex flex-col sm:w-70 lg:w-80 rounded-xl items-center gap-5 text-center'>
                        <div className='bg-yellow-500/15 rounded-full p-3'>
                            <Heart className='text-yellow-500 h-10 w-10'/>
                        </div>
                        <h1 className='font-bold text-2xl'>Quality Food</h1>
                        <p className='opacity-60'>We use only the finest ingredients to prepare delicious meals.</p>
                    </div>
                </div>
                <div>
                    <div className='bg-gray-50 dark:bg-gray-900 shadow-md p-5 flex flex-col sm:w-70 lg:w-80 rounded-xl items-center gap-5 text-center'>
                        <div className='bg-yellow-500/15 rounded-full p-3'>
                            <Users className='text-yellow-500 h-10 w-10'/>
                        </div>
                        <h1 className='font-bold text-2xl'>10k+ Customers</h1>
                        <p className='opacity-60'>Join thousands of satisfied customers who trust FoodieGo.</p>
                    </div>
                </div>
                <div>
                    <div className='bg-gray-50 dark:bg-gray-900 shadow-md p-5 flex flex-col sm:w-70 lg:w-80 rounded-xl items-center gap-5 text-center'>
                        <div className='bg-yellow-500/15 rounded-full p-3'>
                            <Award className='text-yellow-500 h-10 w-10'/>
                        </div>
                        <h1 className='font-bold text-2xl'>Award Winning</h1>
                        <p className='opacity-60'>Recognized for excellence in food delivery and customer service.</p>
                    </div>
                </div>
            </div>
        </div>

        <div className='text-center mb-10 lg:mb-20'>
            <h1 className='text-4xl font-bold mb-15'>Our Values</h1>
            <div className='flex flex-wrap lg:flex-row gap-5'>
                <div className='group hover:scale-105 transition-all ease-in-out duration-300'>
                    <div className='bg-gray-50 dark:bg-gray-900 border-b border-b-yellow-400 shadow-md p-5 flex flex-col sm:w-70 lg:w-80 rounded-xl items-center gap-5 text-center'>
                        <h1 className='flex gap-3 items-center font-bold text-2xl group-hover:text-amber-400  transition-all ease-in-out duration-300'>Quality First <ShieldCheck className='h-6 w-6 text-amber-400'/></h1>
                        <p className='opacity-60'>We never compromise on the quality of food or service we provide.</p>
                    </div>
                </div>
                <div className='group hover:scale-105 transition-all ease-in-out duration-300'>
                    <div className='bg-gray-50 dark:bg-gray-900 border-b border-b-yellow-400 shadow-md p-5 flex flex-col sm:w-70 lg:w-80 rounded-xl items-center gap-5 text-center'>
                        <h1 className='flex gap-3 items-center font-bold text-2xl group-hover:text-amber-400  transition-all ease-in-out duration-300'>Customer Focus <HeartHandshake className='h-6 w-6 text-amber-400'/></h1>
                        <p className='opacity-60'>Your satisfaction is our top priority, always and forever.</p>
                    </div>
                </div>
                <div className='group hover:scale-105 transition-all ease-in-out duration-300'>
                    <div className='bg-gray-50 dark:bg-gray-900 border-b dark:border-b-yellow-400 border-b-amber-400 shadow-lg p-5 flex flex-col sm:w-70 lg:w-80 rounded-xl items-center gap-5 text-center'>
                        <h1 className='flex gap-3 items-center font-bold text-2xl group-hover:text-amber-400  transition-all ease-in-out duration-300'>Innovation<Sparkles className='h-6 w-6 text-amber-400'/></h1>
                        <p className='opacity-60'>We continuously improve our service to serve you better.</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
  )
}

export default About