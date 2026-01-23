import React, { useState, useRef, useEffect, useContext } from 'react';
import { 
  Star, 
  X, 
  CheckCircle2, 
  MessageSquareText, 
  Package, 
  Truck, 
  Calendar, 
  ShoppingBag, 
  Image as ImageIcon,
  Plus,
  Trash2,
  BadgeCheck
} from 'lucide-react';
import { toast } from 'react-toastify';
import axios from 'axios';
import { AppContext } from '../context/AppContext';

export const RateUs = ({orderStatus, selectedOrder}) => {
  const MAX_REVIEWS = 6;
  const fileInputRef = useRef(null);

  const [reviews, setReviews] = useState([]);
  const { backendUrl, userData } = useContext(AppContext)

  // Form State
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState("");
  const [name, setName] = useState(userData.name);
  const [image, setImage] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null); // Object url
  const [loading, setLoading] = useState(false);

  const handleRating = (value) => setRating(value);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please upload a valid image");
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      alert("Image must be under 2MB");
      return;
    }

    // Revoke old preview URL to avoid memory leaks
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }

    const objectUrl = URL.createObjectURL(file);

    setImage(file);
    setPreviewUrl(objectUrl);
  };

  const removeImage = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setImage(null);
    setPreviewUrl(null);
  };

  const productId = selectedOrder?.items[0].productId;

  const handleSubmit = async () => {
    if (rating <= 0 || reviews.length >= MAX_REVIEWS || loading) return;

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("rating", rating);
      formData.append("comment", comment);
      formData.append("name", name);

      if (image) {
        formData.append("image", image);
      }

      const { data } = await axios.post(
        backendUrl + `/api/product/${productId}/review`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } },
      );

      const newReview = {
        rating,
        comment,
        name,
        image: data.review.image, // ImageKit URL
        date: new Date().toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        }),
      };

      setReviews((prev) => [newReview, ...prev]);

      // Reset form
      setRating(0);
      setComment("");
      setImage(null);
      setIsFormOpen(false);

      // Cleanup preview
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
        setPreviewUrl(null);
      }

      toast.success("Review submitted successfully");
    } catch (error) {
      console.error(error);
      alert("Failed to submit review");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);


  return (
    <div className="dark:bg-slate-900 p-4 md:p-8 transition-colors duration-300 flex flex-col items-center">
      <div className="w-full max-w-2xl space-y-6">
        
        {orderStatus === "delivered" && reviews.length < MAX_REVIEWS && (
          <div className="space-y-4">
            {!isFormOpen ? (
              <button
                onClick={() => setIsFormOpen(true)}
                className="w-full py-4 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl text-slate-500 dark:text-slate-400 hover:border-blue-500 hover:text-blue-500 transition-all flex items-center justify-center gap-2 font-medium cursor-pointer"
              >
                <Plus size={20} /> Write a {reviews.length > 0 ? "another" : ""}{" "}
                review
              </button>
            ) : (
              <div className="bg-white dark:bg-gray-800/50 rounded-2xl shadow-xl border border-blue-500/30 dark:border-blue-500/20 p-6 space-y-5 animate-in zoom-in-95 duration-200">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                    New Review
                  </h3>
                  <button
                    onClick={() => setIsFormOpen(false)}
                    className="text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    <X size={20} />
                  </button>
                </div>

                <div className="flex flex-col items-center gap-2 py-4 bg-slate-50 dark:bg-slate-950/30 rounded-xl border border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onMouseEnter={() => setHover(star)}
                        onMouseLeave={() => setHover(0)}
                        onClick={() => handleRating(star)}
                        className="focus:outline-none transform active:scale-90 transition-transform duration-100"
                      >
                        <Star
                          size={32}
                          className={`transition-all duration-200 ${
                            (hover || rating) >= star
                              ? "fill-amber-400 text-amber-400 scale-110"
                              : "text-slate-200 dark:text-slate-800"
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                    <MessageSquareText size={16} className="text-blue-500" />
                    Name
                  </label>
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    disabled
                    className="w-full p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/30 text-slate-900 dark:text-slate-100 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all resize-none"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                    <MessageSquareText size={16} className="text-blue-500" />
                    Comment
                  </label>
                  <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Tell us what you think..."
                    rows={3}
                    className="w-full p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/30 text-slate-900 dark:text-slate-100 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all resize-none"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                    <ImageIcon size={16} className="text-blue-500" />
                    Add Photo
                  </label>

                  {!previewUrl ? (
                    <div
                      onClick={() => !loading && fileInputRef.current?.click()}
                      className={`group cursor-pointer w-full h-32 border-2 border-dashed rounded-xl 
                        flex flex-col items-center justify-center gap-2 transition-all
                        ${
                          loading
                            ? "border-slate-300 text-slate-400 cursor-not-allowed bg-slate-100"
                            : "border-slate-200 dark:border-slate-800 text-slate-400 hover:border-blue-400 hover:text-blue-400 bg-slate-50 dark:bg-slate-950/30"
                        }
                    `}
                    >
                      <Plus
                        className={`transition-transform ${
                          loading ? "" : "group-hover:scale-110"
                        }`}
                      />
                      <span className="text-xs font-medium">
                        {loading ? "Uploading..." : "Upload product photo"}
                      </span>

                      <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleImageUpload}
                        accept="image/*"
                        disabled={loading}
                        className="hidden"
                      />
                    </div>
                  ) : (
                    <div className="relative w-32 h-32 rounded-xl overflow-hidden border-2 border-blue-500">
                      <img
                        src={previewUrl}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />

                      {!loading && (
                        <button
                          onClick={removeImage}
                          className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition-colors shadow-lg"
                        >
                          <X size={14} />
                        </button>
                      )}

                      {loading && (
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                          <span className="text-white text-xs font-semibold animate-pulse">
                            Uploading…
                          </span>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <button
                  onClick={handleSubmit}
                  disabled={rating === 0}
                  className={`w-full cursor-pointer py-4 rounded-xl font-bold text-sm transition-all duration-200 ${
                    rating > 0
                      ? "bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-500/25"
                      : "bg-slate-100 dark:bg-slate-800 text-slate-400 cursor-not-allowed"
                  }`}
                >
                  Post Review
                </button>
              </div>
            )}
          </div>
        )}

        {reviews.length >= MAX_REVIEWS && (
          <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-900/30 p-4 rounded-xl text-center">
            <p className="text-amber-700 dark:text-amber-400 text-sm font-medium">
              Maximum review limit reached ({MAX_REVIEWS}). Thank you for your
              feedback!
            </p>
          </div>
        )}

      </div>
    </div>
  );
};
