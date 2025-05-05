import React from 'react'

const Home = () => {
  return (
    <>
        <h1 className='text-2xl mt-8 font-semibold flex items-center justify-center'>Home Section</h1>
        <h2 className='text-2xl mt-10'>Build Any Ecommerce app from Javascript Mastery along with backend Journey : Or select any one from these 4 Projects</h2>
        <div className='flex flex-col border-2 border-violet-500 w-fit p-4 rounded-2xl mt-5'>
          <h3 className='text-2xl mb-4'>It is all from Javascript Mastery : </h3>
          <a className='text-blue-500 underline decoration-solid' href="https://youtu.be/tS7upsfuxmo?si=uZkV2jUm6BwKiJ0">Tailwind css with nike app </a>
          <a className='text-blue-500 underline decoration-solid' href="https://youtu.be/4mOkFXyxfsU?si=7OzdN3t0VYaaTyEc">Full Stack ECommerce React App with Stripe</a>
          <a className='text-blue-500 underline decoration-solid' href="https://youtu.be/_oO4Qi5aVZs?si=bTYyhaPnVlLq1tr_">Modern website</a>
          <a className='text-blue-500 underline decoration-solid' href="https://youtu.be/FHTbsZEJspU?si=xK__xCzzyRckBpas">youtube clone fully functional</a>
          <a className='text-blue-500 underline decoration-solid' href="https://youtu.be/I1cpb0tYV74?si=aN-Vy5luUkl4cR_b">spotify clone Redux-toolkit and Rapid Api</a>
        </div>
        <h1 className='text-2xl mt-8 font-semibold flex items-center justify-center'>Build Tic Toe Game By Using React By Yourself from scratch don't take help of anything</h1>
        <p className='mt-5 flex items-center justify-center'>Create and Learn : Project Based Learning</p>
    </>
  )
}

export default Home