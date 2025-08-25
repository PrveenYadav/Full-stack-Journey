import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { assets, blog_data, comments_data } from '../assets/assets';
import Navbar from '../components/Navbar';
import Moment from 'moment'; // for formatting date
import Footer from '../components/Footer';
import Loader from '../components/Loader';
import { useAppContext } from '../context/AppContext';
import toast from 'react-hot-toast';

const Blog = () => {

  const { id } = useParams();
  const {axios} = useAppContext();

  const [data, setData] = useState(null)
  const [comments, setComments] = useState([])
  const [name, setName] = useState('')
  const [content, setContent] = useState('')

  const fetchBlogData = async () => {
    try {
      const {data} = await axios.get(`/api/blog/${id}`);
      data.success ? setData(data.blog) : toast.error(data.message);

    } catch (error) {
      toast.error(error.message);
    }
  }

  const fetchComments = async () => {
    try {
      const {data} = await axios.post('/api/blog/comments', {blogId: id});
      if (data.success) {
        setComments(data.comments);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  }

  const addComment = async (e) => {
    e.preventDefault();
    try {
      const {data} = await axios.post('/api/blog/add-comment', {blog: id, name, content});
      if (data.success) {
        toast.success(data.message);
        setName('');
        setContent('');
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  }

  useEffect(() => {
    fetchBlogData()
    fetchComments()
  }, [])

  return data ? (
    <div className='relative'>
        <img src={assets.gradientBackground} alt="" className='absolute -top-50 -z-1 opacity-50' />

        {/* Navbar component */}
        <Navbar/>

        <div className='text-center mt-20 text-gray-600'>
          <p className='text-primary py-4 font-medium'>Published on {Moment(data.createdAt).format('MMMM Do, YYYY')}</p>
          <h1 className='text-2xl sm:text-5xl font-semibold max-w-2xl mx-auto text-gray-800'>{data.title}</h1>
          <h2 className='my-5 max-w-lg mx-auto truncate'>{data.subtitle}</h2>
          <p className='inline-block text-primary font-medium py-1 px-4 rounded-full mb-6 border text-sm border-primary/35 bg-primary/5'>Chris Hemsworth</p>
        </div>

        <div className='mx-5 max-w-5xl md:mx-auto my-10 mt-6 '>
          <img src={data.image} alt="" className='rounded-3xl mb-5'/>

          <div className='rich-text max-w-3xl mx-auto' dangerouslySetInnerHTML={{__html: data.description}}></div>

          {/* Comments */}
          <div className='mt-14 mb-10 max-w-3xl mx-auto'>
            <p className='font-semibold mb-4'>Comments ({comments.length})</p>
            <div className='flex flex-col gap-4'>
              {comments.map((comment, index) => (
                <div key={index} className='relative bg-primary/2 border border-primary/5 max-w-xl p-4 rounded text-gray-600'>
                  <div className='flex items-center gap-2 mb-2'>
                    <img src={assets.user_icon} alt="" className='w-6' />
                    <p className='font-medium'>{comment.name}</p>
                  </div>
                  <p className='text-sm max-w-md ml-8'>{comment.content}</p>
                  <div>{Moment(comment.createdAt).fromNow()}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Add comment section */}
          <div className='max-w-3xl mx-auto'>
            <p className='font-semibold mb-4'>Add a comment</p>
            <form onSubmit={addComment} className='flex items-start flex-col gap-4 max-w-lg'>

              <input 
                type="text" 
                placeholder='Name' 
                required 
                value={name}
                onChange={(e) => setName(e.target.value)}
                className='border border-gray-300 rounded outline-none w-full p-2' 
              />
              
              <textarea 
                placeholder='Comment' 
                required 
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className='border border-gray-300 rounded outline-none w-full p-2 h-48'
              ></textarea>

              <button 
                type='submit' 
                className='bg-primary text-white px-8 p-2 rounded hover:scale-102 transition-all cursor-pointer'
              >Submit</button>

            </form>
          </div>

          {/* Social media section */}
          <div className='my-24 max-w-3xl mx-auto'>
              <p className='font-semibold my-4'>Share this blog on social media</p>
              <div className='flex'>
                <img src={assets.facebook_icon} width={50} alt="" />
                <img src={assets.twitter_icon} width={50} alt="" />
                <img src={assets.googleplus_icon} width={50} alt="" />
              </div>
          </div>

        </div>
        
        {/* Footer component */}
        <Footer/>

    </div>

  ) : <Loader/>
}

export default Blog