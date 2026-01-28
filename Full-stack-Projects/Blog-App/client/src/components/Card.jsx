import React from 'react'
import { blog_data } from '../assets/assets'
import { useNavigate } from 'react-router-dom';

const Card = ({blog}) => {

    const {title, description, image, category, _id} = blog;

    const navigate = useNavigate();

  return (
    <div onClick={() => navigate(`/blog/${_id}`)} className='w-full cursor-pointer overflow-hidden shadow hover:scale-102 hover:shadow-primary/25 duration-300 rounded-lg dark:bg-gray-900'>
        <img src={image} alt="" className='aspect-video' />
        <span className='ml-5 mt-4 px-3 py-1 inline-block bg-primary/20 rounded-full text-primary text-xs'>{category}</span>

        <div className='p-5'>
            <h5 className='mb-2 font-medium text-gray-900 dark:text-white'>{title}</h5>
            <p className='mb-3 text-xs text-gray-600 dark:text-gray-400' dangerouslySetInnerHTML={{__html: description.slice(0, 80)}}></p>
        </div>
    </div>
  )
}

export default Card