import {
  Award, Clock, Heart, Users,
  ShieldCheck, Sparkles, HeartHandshake
} from 'lucide-react'

const About = () => {
  return (
    <div className='w-full min-h-screen px-4 sm:px-6 lg:px-16 py-16 flex flex-col items-center gap-20 
      bg-white dark:bg-zinc-950 text-zinc-800 dark:text-zinc-100'>

      <div className='max-w-3xl text-center flex flex-col gap-5'>
        <h1 className='text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight'>
          About <span className='text-orange-500'>FoodieGo</span>
        </h1>

        <p className='text-base sm:text-lg opacity-70 leading-relaxed'>
          Delivering your favorite meals{' '}
          <span className='text-orange-500 font-semibold'>fast</span>,{' '}
          <span className='text-orange-500 font-semibold'>fresh</span>, and{' '}
          <span className='text-orange-500 font-semibold'>hassle-free</span>.
        </p>
      </div>

      <div className='max-w-3xl text-center flex flex-col gap-5'>
        <h2 className='text-2xl sm:text-3xl font-bold'>
          Our Mission
        </h2>

        <p className='text-sm sm:text-base lg:text-lg opacity-70 leading-relaxed'>
          We connect people with amazing food from local restaurants. 
          Our goal is to make food delivery simple, fast, and reliable — 
          so you can enjoy every bite without worrying about the rest.
        </p>
      </div>

      <div className='w-full max-w-6xl text-center'>
        <h2 className='text-2xl sm:text-3xl font-bold mb-10'>
          Why Choose Us
        </h2>

        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5'>
          {[
            { icon: Clock, title: "Fast Delivery", desc: "Hot food delivered quickly." },
            { icon: Heart, title: "Quality Food", desc: "Fresh ingredients, great taste." },
            { icon: Users, title: "10k+ Customers", desc: "Trusted by thousands." },
            { icon: Award, title: "Award Winning", desc: "Top-rated service." }
          ].map((item, i) => (
            <div
              key={i}
              className='group p-5 rounded-xl border border-zinc-200 dark:border-zinc-800 
              bg-zinc-50 dark:bg-zinc-900 
              hover:shadow-lg hover:-translate-y-1 transition-all duration-300'
            >
              <div className='bg-orange-500/10 rounded-full p-3 w-fit mx-auto mb-4'>
                <item.icon className='text-orange-500 h-7 w-7'/>
              </div>

              <h3 className='font-semibold text-lg mb-1 group-hover:text-orange-500 transition'>
                {item.title}
              </h3>

              <p className='text-sm opacity-60'>{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      <div className='w-full max-w-5xl text-center'>
        <h2 className='text-2xl sm:text-3xl font-bold mb-10'>
          Our Values
        </h2>

        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5'>
          {[
            { icon: ShieldCheck, title: "Quality First", desc: "We never compromise on quality." },
            { icon: HeartHandshake, title: "Customer First", desc: "Your happiness matters most." },
            { icon: Sparkles, title: "Innovation", desc: "We constantly improve our service." }
          ].map((item, i) => (
            <div
              key={i}
              className='group p-5 rounded-xl border border-zinc-200 dark:border-zinc-800 
              bg-zinc-50 dark:bg-zinc-900 
              hover:scale-[1.03] transition-all duration-300'
            >
              <div className='flex justify-center mb-3'>
                <item.icon className='text-orange-500 h-6 w-6'/>
              </div>

              <h3 className='font-semibold text-lg mb-1 group-hover:text-orange-500 transition'>
                {item.title}
              </h3>

              <p className='text-sm opacity-60'>{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

    </div>
  )
}

export default About