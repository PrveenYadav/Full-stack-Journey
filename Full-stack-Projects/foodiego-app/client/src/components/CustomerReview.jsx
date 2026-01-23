import React, { useState, useRef, useEffect, useContext, useMemo, createContext } from 'react';
import { 
  Star, 
  MessageSquare, 
  ThumbsUp, 
  MoreVertical, 
  Calendar, 
  Plus, 
  X, 
  Image as ImageIcon,
  BadgeCheck,
  Loader2
} from 'lucide-react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { AppContext } from '../context/AppContext';


const StarRating = ({ rating, size = 16, className = "", onRatingChange, hoverRating }) => {
  return (
    <div className={`flex items-center gap-0.5 ${className}`}>
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          size={size}
          onMouseEnter={() => onRatingChange && onRatingChange.setHover(star)}
          onMouseLeave={() => onRatingChange && onRatingChange.setHover(0)}
          onClick={() => onRatingChange && onRatingChange.setRating(star)}
          className={`${onRatingChange ? 'cursor-pointer transition-transform active:scale-90' : ''} ${
            star <= (hoverRating || rating)
              ? "fill-yellow-400 text-yellow-400"
              : "text-gray-300 dark:text-gray-600"
          }`}
        />
      ))}
    </div>
  );
};

const RatingBar = ({ label, percentage, count }) => (
  <div className="flex items-center gap-4 text-sm">
    <span className="w-12 font-medium text-slate-600 dark:text-slate-400 whitespace-nowrap">{label}</span>
    <div className="flex-1 h-2.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
      <div 
        className="h-full bg-yellow-400 rounded-full transition-all duration-500" 
        style={{ width: `${percentage}%` }}
      />
    </div>
    <span className="w-8 text-right text-slate-500">{count}</span>
  </div>
);

const ReviewCard = ({ review }) => {
  const formattedDate = new Date(review.date).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });

  return (
    <div className="py-8 border-b border-slate-100 dark:border-slate-800 last:border-0 animate-in fade-in slide-in-from-bottom-2 duration-300">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-bold border border-indigo-200 dark:border-indigo-800">
            {review.name?.charAt(0) || 'U'}
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h4 className="font-semibold text-slate-900 dark:text-white leading-tight">
                {review.name || "Anonymous"}
              </h4>
              {review.name && <BadgeCheck className="h-4 w-4 text-blue-500" />}
            </div>
            <div className="flex items-center gap-2 mt-1">
              <StarRating rating={review.rating} size={14} />
              <span className="text-[10px] uppercase tracking-wider text-slate-400 flex items-center gap-1">
                <Calendar size={10} />
                {formattedDate}
              </span>
            </div>
          </div>
        </div>
        <button className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors">
          <MoreVertical size={18} />
        </button>
      </div>

      <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-sm md:text-base mb-4">
        {review.comment}
      </p>

      {review.image && (
        <div className="mb-4">
          <img 
            src={review.image} 
            alt="Review attachment" 
            className="max-w-[200px] h-auto rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm hover:scale-[1.02] transition-transform cursor-zoom-in"
          />
        </div>
      )}

      <div className="flex items-center gap-6 mt-2">
        <button className="flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
          <ThumbsUp size={14} />
          Helpful
        </button>
        <button className="flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
          <MessageSquare size={14} />
          Reply
        </button>
      </div>
    </div>
  );
};


export const CustomerReview = ({ productId = "default_id" }) => {

  const { backendUrl, userData, isLoggedIn } = useContext(AppContext)

  const fileInputRef = useRef(null);

  // Data States
  const [productReviews, setProductReviews] = useState([]);
  const [loadingReviews, setLoadingReviews] = useState(false);
  
  // Form States
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState("");
  const [image, setImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch Reviews
  const getProductReviews = async () => {
    if (!productId || !backendUrl) return;
    try {
      setLoadingReviews(true);
      const { data } = await axios.get(`${backendUrl}/api/product/${productId}/reviews`);
      setProductReviews(data.reviews || []);
    } catch (err) {
      console.error(err);
      // Not using toast.error here to prevent noise in preview
    } finally {
      setLoadingReviews(false);
    }
  };

  useEffect(() => {
    getProductReviews();
  }, [productId, backendUrl]);


  const stats = useMemo(() => {
    if (productReviews.length === 0) return { avg: 0, total: 0, distributions: [] };
    
    const total = productReviews.length;
    const sum = productReviews.reduce((acc, curr) => acc + curr.rating, 0);
    const avg = sum / total;

    const counts = [0, 0, 0, 0, 0];
    productReviews.forEach(r => {
      if (r.rating >= 1 && r.rating <= 5) counts[r.rating - 1]++;
    });

    const distributions = counts.map((count, i) => ({
      label: `${i + 1} Star`,
      count,
      percentage: (count / total) * 100
    })).reverse();

    return { avg, total, distributions };
  }, [productReviews]);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
        alert("Image must be under 2MB");
        return;
    }

    if (previewUrl) URL.revokeObjectURL(previewUrl);
    const objectUrl = URL.createObjectURL(file);
    setImage(file);
    setPreviewUrl(objectUrl);
  };

  const removeImage = () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setImage(null);
    setPreviewUrl(null);
  };

  // Submit Review
  const handleSubmit = async () => {
    if (rating === 0 || !backendUrl) return;
    if (!comment.trim()) return;

    try {
      setIsSubmitting(true);
      const formData = new FormData();
      formData.append("rating", rating);
      formData.append("comment", comment);
      formData.append("name", userData?.name || "Anonymous");
      if (image) formData.append("image", image);

      await axios.post(
        `${backendUrl}/api/product/${productId}/review`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      // Reset Form
      setRating(0);
      setComment("");
      removeImage();
      setIsFormOpen(false);
      
      // Refresh list/product review
      getProductReviews();
    } catch (error) {
      console.error(error);
      alert("Failed to submit review");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-200 font-sans">

      <div className="max-w-7xl mx-auto">
        
        <div className="mb-10 text-center md:text-left">
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Customer Reviews</h2>
          <p className="text-slate-500 dark:text-slate-400">Honest feedback from our customers.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          <div className="lg:col-span-4 space-y-8">
            <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 sticky top-24">
              <div className="text-center mb-8">
                <div className="text-5xl font-black text-slate-900 dark:text-white mb-2">
                  {stats.avg.toFixed(1)}
                </div>
                <div className="flex justify-center mb-2">
                  <StarRating rating={stats.avg} size={24} />
                </div>
                <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">
                  Based on {stats.total} reviews
                </p>
              </div>

              <div className="space-y-4 mb-8">
                {stats.distributions.length > 0 ? stats.distributions.map((dist) => (
                  <RatingBar 
                    key={dist.label} 
                    label={dist.label} 
                    percentage={dist.percentage} 
                    count={dist.count} 
                  />
                )) : (
                   [5,4,3,2,1].map(n => <RatingBar key={n} label={`${n} Star`} percentage={0} count={0} />)
                )}
              </div>

                {userData?.isAccountVerified && (
                    <button 
                        onClick={() => setIsFormOpen(!isFormOpen)}
                        className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-semibold transition-all shadow-lg shadow-indigo-200 dark:shadow-none flex items-center justify-center gap-2"
                    >
                        {isFormOpen ? <X size={18} /> : <Plus size={18} />}
                        {isFormOpen ? "Cancel Review" : "Write a Review"}
                    </button>
                )}
            </div>
          </div>

          
          <div className="lg:col-span-8 space-y-6">
            
            {isFormOpen && (
              <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 md:p-8 shadow-xl border-2 border-indigo-500/20 animate-in zoom-in-95 duration-200">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6">Share your experience</h3>
                
                <div className="space-y-6">
                  {/* Star Picker */}
                  <div className="flex flex-col items-center p-6 bg-slate-50 dark:bg-slate-950/50 rounded-xl border border-slate-100 dark:border-slate-800">
                    <p className="text-sm font-medium text-slate-500 mb-3 uppercase tracking-wider">Overall Rating</p>
                    <StarRating 
                      rating={rating} 
                      hoverRating={hover}
                      size={40} 
                      onRatingChange={{ setRating, setHover }} 
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Posting as</label>
                    <div className="w-full p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50 text-slate-600 dark:text-slate-300 text-sm border border-slate-100 dark:border-slate-800">
                      {userData?.name || "Guest User"}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Comment</label>
                    <textarea
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      placeholder="What did you like or dislike?"
                      rows={4}
                      className="w-full p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                      <ImageIcon size={14} /> Add Product Photo
                    </label>
                    
                    {!previewUrl ? (
                      <div 
                        onClick={() => fileInputRef.current?.click()}
                        className="cursor-pointer group w-full h-32 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl flex flex-col items-center justify-center gap-2 text-slate-400 hover:border-indigo-400 hover:text-indigo-400 transition-all"
                      >
                        <Plus size={24} className="group-hover:scale-110 transition-transform" />
                        <span className="text-xs font-medium">Click to upload (Max 2MB)</span>
                        <input 
                          type="file" 
                          ref={fileInputRef} 
                          onChange={handleImageUpload} 
                          accept="image/*" 
                          className="hidden" 
                        />
                      </div>
                    ) : (
                      <div className="relative w-32 h-32 rounded-xl overflow-hidden border-2 border-indigo-500 group">
                        <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                        <button 
                          onClick={removeImage}
                          className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition-colors shadow-lg"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    )}
                  </div>
                    
                  <button
                    onClick={handleSubmit}
                    disabled={isSubmitting || rating === 0}
                    className={`w-full py-4 rounded-xl font-bold text-white transition-all shadow-lg flex items-center justify-center gap-2 ${
                      rating > 0 && !isSubmitting
                        ? "bg-indigo-600 hover:bg-indigo-700 shadow-indigo-500/25"
                        : "bg-slate-300 dark:bg-slate-800 cursor-not-allowed shadow-none"
                    }`}
                  >
                    {isSubmitting ? <Loader2 className="animate-spin" size={20} /> : "Post Review"}
                  </button>
                </div>
              </div>
            )}

            {/* Reviews List section */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 md:p-10 shadow-sm border border-slate-100 dark:border-slate-800">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-6 border-b border-slate-100 dark:border-slate-800">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                  Latest Reviews
                </h3>
                <div className="flex items-center gap-3">
                  <span className="text-sm text-slate-500">Sort:</span>
                  <select className="bg-slate-50 dark:bg-slate-800 text-sm font-medium py-1.5 px-3 rounded-lg border-0 focus:ring-2 focus:ring-indigo-500 outline-none text-slate-700 dark:text-slate-300">
                    <option>Newest First</option>
                    <option>Highest Rated</option>
                  </select>
                </div>
              </div>

              <div className="divide-y divide-slate-100 dark:divide-slate-800">
                {loadingReviews ? (
                  <div className="py-20 flex flex-col items-center justify-center text-slate-400 gap-4">
                    <Loader2 className="animate-spin" size={32} />
                    <p className="text-sm font-medium">Fetching community feedback...</p>
                  </div>
                ) : productReviews.length > 0 ? (
                  productReviews.map((review) => (
                    <ReviewCard key={review._id} review={review} />
                  ))
                ) : (
                  <div className="py-20 text-center">
                    <MessageSquare size={48} className="mx-auto text-slate-200 dark:text-slate-800 mb-4" />
                    <p className="text-slate-500 dark:text-slate-400">No reviews yet. Be the first to share your thoughts!</p>
                  </div>
                )}
              </div>

              {productReviews.length > 5 && (
                <button className="w-full mt-8 py-3 text-sm font-bold text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-xl transition-colors">
                  View All {productReviews.length} Reviews
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}