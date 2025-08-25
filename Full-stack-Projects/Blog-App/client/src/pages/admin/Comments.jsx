import React, { useEffect, useState } from 'react'
import { comments_data } from '../../assets/assets'
import CommentTableItem from '../../components/admin/CommentTableItem'
import { useAppContext } from '../../context/AppContext'
import toast from 'react-hot-toast'

const Comments = () => {

  const [comments, setComments] = useState([])
  const [filter, setFilter] = useState('Not Approved')

  const {axios} = useAppContext();

  const fetchComments = async () => {
    try {
      const {data} = await axios.get('/api/admin/comments');
      data.success ? setComments(data.comments) : toast.error(data.message);
    } catch (error) {
      toast.error(error.message);
    }
  }

  useEffect(() => {
    fetchComments()
  }, [])

  return (
    <div className='flex-1 pt-5 sm:pt-12 sm:pl-16 bg-blue-50/50 dark:bg-gradient-to-tr from-black via-[#0a0a23] to-[#1e3a8a]'>

      <div className='flex justify-between items-center max-w-3xl'>
        <h1>Comments</h1>
        <div className='flex gap-4'>
          <button onClick={() => setFilter('Approved')} className={`shadow-custom-sm border rounded-full px-4 py-1 cursor-pointer text-xs ${filter === 'Approved' ? 'text-primary' : 'text-gray-700 dark:text-gray-300'}`}>Approved</button>

          <button onClick={() => setFilter('Not Approved')} className={`shadow-custom-sm border rounded-full px-4 py-1 cursor-pointer text-xs ${filter === 'Not Approved' ? 'text-primary' : 'text-gray-700 dark:text-gray-300'}`}>Not Approved</button>
        </div>
      </div>

      <div className='relative h-4/5 max-w-3xl overflow-x-auto mt-4 bg-white dark:bg-gradient-to-bl from-black via-[#0a0a23] to-[#1e3a8a] shadow rounded-lg scrollbar-hide'>
        <table className='w-full text-sm text-gray-500 dark:text-gray-300'>
          <thead className='text-xs text-gray-700 dark:text-gray-200 text-left uppercase'>
            <tr>
              <th scope='col' className='px-6 py-3'>Blog Title & Comment</th>
              <th scope='col' className='px-6 py-3 max-sm:hidden'>Date</th>
              <th scope='col' className='px-6 py-3'>Action</th>
            </tr>
          </thead>
          <tbody>
            {comments.filter((comment) => {
              if(filter === "Approved") return comment.isApproved === true;
              return comment.isApproved === false;
            }).map((comment, index) => <CommentTableItem key={comment._id} comment={comment} index={index + 1} fetchComments={fetchComments}/>)}
          </tbody>
        </table>
      </div>

    </div>
  )
}

export default Comments