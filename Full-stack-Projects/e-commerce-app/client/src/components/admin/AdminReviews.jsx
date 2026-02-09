import React, { useState, useEffect, useContext } from 'react';
import { Trash2, Star, MessageSquare, Package, User, Calendar, Loader2 } from 'lucide-react';
import { AppContext } from '../../context/AppContext.jsx';
import axios from 'axios';
import { toast } from 'react-toastify';

export const AdminReviews = () => {
  const [reviewData, setReviewData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);

  const { backendUrl } = useContext(AppContext)

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(
        backendUrl + "/api/admin/product/reviews",
      );

      setReviewData(data);
      setLoading(false);
    } catch (err) {
      console.log("Failed to load reviews. Please try again." || err.message);
      setLoading(false);
    }
  };

  const handleDeleteReview = async (reviewId, productId) => {
    // Confirmation before deleting
    if (!window.confirm("Are you sure you want to delete this review? This action cannot be undone.")) {
      return;
    }

    try {
      setDeletingId(reviewId);
      
      const { data } = await axios.delete(backendUrl + `/api/admin/product/${productId}/reviews/${reviewId}`);

      if (data) {
        fetchReviews();
        setDeletingId(null);
        toast.success(data.message)
      } else {
        toast.error(data.message)
      }

    } catch (err) {
      setDeletingId(null);
      console.log(err.message || "Error in deleting review.");
    }
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }).map((_, i) => (
      <Star
        key={i}
        size={14}
        className={`${
          i < rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300 dark:text-gray-600"
        }`}
      />
    ));
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 space-y-4">
        <Loader2 className="animate-spin text-blue-600 dark:text-blue-400" size={40} />
        <p className="text-gray-500 dark:text-gray-400 animate-pulse font-medium">Fetching customer reviews...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black dark:text-white uppercase tracking-tighter">Customer Reviews</h2>
          <p className="text-zinc-500 font-bold text-sm uppercase tracking-widest mt-1">Manage and moderate feedback from your users</p>
        </div>
        
        <div className="flex items-center gap-3">
            <div className="bg-zinc-100 dark:bg-zinc-800 dark:text-white px-4 py-2 rounded-lg">
                <span className="text-xs font-bold uppercase block">Total Reviews</span>
                <span className="text-lg font-bold text-gray-800 dark:text-white">{reviewData?.totalReviews || 0}</span>
            </div>
        </div>
      </div>

      {!reviewData?.reviews || reviewData.reviews.length === 0 ? (
        <div className="bg-white dark:bg-zinc-900 border border-dashed border-gray-300 dark:border-gray-700 rounded-2xl p-12 text-center">
          <MessageSquare size={48} className="mx-auto text-gray-300 dark:text-gray-600 mb-4" />
          <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-tighter">No reviews yet</h3>
          <p className="text-gray-500 dark:text-gray-500 mt-2 uppercase tracking-tighter">When customers leave reviews, they will appear here.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {reviewData.reviews.map((review) => (
            <div 
              key={review.reviewId} 
              className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-gray-700 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow group relative"
            >
              <div className="flex flex-col lg:flex-row gap-6">
                
                <div className="w-full lg:w-48 h-32 flex-shrink-0 bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden relative">
                  {review.image ? (
                    <img 
                      src={review.image} 
                      alt={review.productName} 
                      className="w-full h-full object-cover"
                      onError={(e) => { e.target.src = 'https://via.placeholder.com/150?text=No+Image'; }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      <Package size={32} />
                    </div>
                  )}
                  <div className="absolute top-2 left-2 bg-black/60 backdrop-blur-sm text-white text-[10px] px-2 py-0.5 rounded font-mono">
                    ID: {review.productId.substring(review.productId.length - 4)}
                  </div>
                </div>

                <div className="flex-1 space-y-3">
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <div>
                      <h4 className="font-bold text-gray-900 dark:text-white text-lg leading-tight">
                        {review.productName}
                      </h4>
                      <div className="flex items-center gap-2 mt-1">
                        <div className="flex">
                           {renderStars(review.rating)}
                        </div>
                        <span className="text-xs font-semibold text-gray-500 dark:text-gray-400">
                           ({review.rating}/5)
                        </span>
                      </div>
                    </div>
                    
                    <button
                      onClick={() => handleDeleteReview(review.reviewId, review.productId)}
                      disabled={deletingId === review.reviewId}
                      className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all cursor-pointer"
                      title="Delete Review"
                    >
                      {deletingId === review.reviewId ? (
                        <Loader2 className="animate-spin" size={20} />
                      ) : (
                        <Trash2 size={20} />
                      )}
                    </button>
                  </div>

                  <p className="text-gray-700 dark:text-gray-300 italic text-sm leading-relaxed bg-zinc-100 dark:bg-zinc-800 p-3 rounded-lg border-l-4 border-zinc-800 dark:border-zinc-200">
                    "{review.comment}"
                  </p>

                  <div className="flex flex-wrap items-center gap-y-2 gap-x-6 text-xs text-gray-500 dark:text-gray-400">
                    <div className="flex items-center gap-1.5">
                      <User size={14} className="text-blue-500" />
                      <span className="font-medium text-gray-700 dark:text-gray-300">{review.name}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Calendar size={14} />
                      <span>{formatDate(review.date)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {reviewData?.totalPages > 1 && (
        <div className="flex justify-center pt-4">
            <nav className="flex items-center gap-2">
                <button className="px-3 py-1 rounded bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 disabled:opacity-50">Prev</button>
                <span className="text-sm text-gray-500">Page {reviewData.currentPage} of {reviewData.totalPages}</span>
                <button className="px-3 py-1 rounded bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 disabled:opacity-50">Next</button>
            </nav>
        </div>
      )}
    </div>
  );
};