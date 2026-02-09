import React, { useState, useRef, useEffect, useContext, useMemo } from 'react';
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
  Loader2,
  CheckCircle2
} from 'lucide-react';
import axios from 'axios';
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
    <span className="w-12 font-medium text-zinc-600 dark:text-zinc-400 whitespace-nowrap">{label}</span>
    <div className="flex-1 h-2.5 bg-zinc-200 dark:bg-zinc-800 rounded-full overflow-hidden">
      <div 
        className="h-full bg-yellow-400 rounded-full transition-all duration-500" 
        style={{ width: `${percentage}%` }}
      />
    </div>
    <span className="w-8 text-right text-zinc-500">{count}</span>
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
              {review.name && (
               <div className="flex items-center gap-1 text-[10px] bg-green-50 dark:bg-green-500/10 text-green-600 dark:text-green-400 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
                  <CheckCircle2 className="w-3 h-3" />
                  Verified
                </div>
              )}
              {/* {review.name && <BadgeCheck className="h-4 w-4 text-blue-500" />} */}
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
            className="w-[100px] sm:w-[150px] h-auto rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm hover:scale-[1.02] transition-transform cursor-zoom-in"
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

  const { backendUrl } = useContext(AppContext)
  const [sortBy, setSortBy] = useState('newest');
  const [productReviews, setProductReviews] = useState([]);
  const [loadingReviews, setLoadingReviews] = useState(false);
  
  const getProductReviews = async () => {
    if (!productId || !backendUrl) return;
    try {
      setLoadingReviews(true);
      const { data } = await axios.get(`${backendUrl}/api/product/${productId}/reviews`);
      setProductReviews(data.reviews || []);
    } catch (err) {
      console.error(err.message || "Error in getting reviews");
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

  const sortedReviews = React.useMemo(() => {
    const copy = [...productReviews];

    switch (sortBy) {
      case "highest":
        return copy.sort((a, b) => b.rating - a.rating);

      case "lowest":
        return copy.sort((a, b) => a.rating - b.rating);

      case "newest":
      default:
        return copy.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
    }
  }, [productReviews, sortBy]);

  const [showAllReviews, setShowAllReviews] = useState(false);
  const visibleReviews = showAllReviews ? sortedReviews : sortedReviews.slice(0, 3);


  return (
    <div className="min-h-screen py-12 transition-colors duration-200 font-sans">

      <div className="max-w-7xl mx-auto">
        
        <div className="mb-10 text-left">
          <h2 className="text-2xl font-extrabold text-zinc-950 dark:text-white mb-2 uppercase tracking-tighter">Customer Reviews</h2>
          <p className="text-zinc-500 dark:text-zinc-400 font-semibold tracking-tighter">Honest feedback from our customers.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          <div className="lg:col-span-4 space-y-8">
            <div className="dark:bg-zinc-900/50 p-8 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 sticky top-24">
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
            </div>
          </div>

          
          <div className="lg:col-span-8 space-y-6">
            {/* Reviews List section */}
            <div className="bg-white dark:bg-zinc-900/50 rounded-2xl p-6 md:p-10 shadow-sm border border-slate-100 dark:border-slate-800 ">

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-6 border-b border-slate-100 dark:border-slate-800">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                  Latest Reviews
                </h3>
                <div className="flex items-center gap-3">
                  <span className="text-sm text-slate-500">Sort:</span>
                  <select 
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="bg-slate-50 dark:bg-zinc-800 text-sm font-medium py-1.5 px-3 rounded-lg border-0 focus:ring-2 focus:ring-zinc-100 dark:focus:ring-zinc-700 outline-none text-slate-700 dark:text-slate-300"
                  >
                    <option value="newest">Newest First</option>
                    <option value="highest">Highest Rated</option>
                    <option value="lowest">Lowest Rated</option>
                  </select>
                </div>
              </div>

              <div className="divide-y divide-slate-100 dark:divide-slate-800">
                {loadingReviews ? (
                  <div className="py-20 flex flex-col items-center justify-center text-slate-400 gap-4">
                    <Loader2 className="animate-spin" size={32} />
                    <p className="text-sm font-medium">Fetching community feedback...</p>
                  </div>
                ) : visibleReviews.length > 0 ? (
                  visibleReviews.map((review) => (
                    <ReviewCard key={review._id} review={review} />
                  ))
                ) : (
                  <div className="py-20 text-center">
                    <MessageSquare size={48} className="mx-auto text-slate-200 dark:text-slate-800 mb-4" />
                    <p className="text-slate-500 dark:text-slate-400">No reviews yet. Be the first to share your thoughts!</p>
                  </div>
                )}
              </div>

              {sortedReviews.length > 3 && (
                <button
                  onClick={() => setShowAllReviews((v) => !v)}
                  className="w-full mt-8 py-3 text-sm font-bold text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-xl transition-colors cursor-pointer"
                >
                  {/* View All {sortedReviews.length} Reviews */}
                   {showAllReviews
                    ? "Show Less Reviews"
                    : `View All ${sortedReviews.length} Reviews`}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}