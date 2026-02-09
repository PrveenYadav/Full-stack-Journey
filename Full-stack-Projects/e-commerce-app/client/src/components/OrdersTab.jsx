import React, { useState, useContext, useEffect } from 'react';
import { ChevronRight, ArrowLeft, CheckCircle2, Circle, Clock, Package, Trash2, Truck, Star, X, Camera, AlertCircle, MapPin, PackageOpenIcon, ArrowRight } from 'lucide-react';
import { AppContext } from '../context/AppContext.jsx';
import { toast } from 'react-toastify';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const ReviewModal = ({ item, onClose }) => {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  const { backendUrl, userData } = useContext(AppContext);

  // Handle preview generation
  useEffect(() => {
    if (!file) {
      setPreview(null);
      return;
    }

    const objectUrl = URL.createObjectURL(file);
    setPreview(objectUrl);

    // Clean up memory when component unmounts or file changes
    return () => URL.revokeObjectURL(objectUrl);
  }, [file]);

  const handleSubmitReview = async () => {
    setLoading(true);
    const formData = new FormData();
    formData.append("rating", rating);
    formData.append("comment", comment);
    formData.append("name", userData.name);
    if (file) formData.append("image", file);

    try {
      await axios.post(`${backendUrl}/api/product/${item.productId}/review`, formData);
      toast.success("Review submitted!");
      onClose();
    } catch (err) {
      console.log("Error submitting review", err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-[150] flex items-center justify-center p-4">
      <div className="bg-white dark:bg-zinc-900 dark:text-white w-full max-w-md rounded-[2.5rem] p-10 relative">
        <button onClick={onClose} className="absolute top-6 right-6 opacity-40 hover:opacity-100 cursor-pointer"><X /></button>
        
        <h4 className="text-2xl font-black uppercase tracking-tighter mb-2">Write a Review</h4>
        <p className="text-zinc-500 text-xs font-bold mb-8 uppercase tracking-widest">{item.name}</p>

        <div className="space-y-6">
          <div className="flex justify-center gap-2">
            {[1, 2, 3, 4, 5].map((num) => (
              <Star 
                key={num} 
                size={32} 
                onClick={() => setRating(num)}
                className={`cursor-pointer transition-all ${num <= rating ? 'text-yellow-400 fill-yellow-400' : 'text-zinc-300'}`}
              />
            ))}
          </div>

          <textarea 
            placeholder="Share your experience with this product..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="w-full p-5 rounded-2xl bg-zinc-100 dark:bg-zinc-800 outline-none text-sm h-32"
          />

          <div className="relative">
            {!preview ? (
              <label className="flex flex-col items-center justify-center border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 cursor-pointer hover:border-black dark:hover:border-white transition-all">
                <Camera className="opacity-40 mb-2" />
                <span className="text-[10px] font-black uppercase tracking-widest opacity-40">Add a photo</span>
                <input type="file" className="hidden" accept="image/*" onChange={(e) => setFile(e.target.files[0])} />
              </label>
            ) : (
              <div className="relative rounded-2xl overflow-hidden h-32 border border-zinc-200 dark:border-zinc-800">
                <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                <button 
                  onClick={() => setFile(null)}
                  className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            )}
          </div>

          <button
            onClick={handleSubmitReview}
            disabled={loading}
            className="w-full py-4 bg-black dark:bg-white text-white dark:text-black rounded-2xl font-black uppercase text-sm tracking-widest disabled:opacity-50 cursor-pointer"
          >
            {loading ? "Submitting..." : "Post Review"}
          </button>
        </div>
      </div>
    </div>
  );
};

const OrderModel = ({ selectedOrder, setSelectedOrder, refreshOrders }) => {
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [reviewingItem, setReviewingItem] = useState(null);
  const [cancelling, setCancelling] = useState(false);

  const { backendUrl } = useContext(AppContext);

  const statuses = [
    { label: 'Ordered', key: 'Processing', icon: Clock },
    { label: 'Shipped', key: 'Shipped', icon: Truck },
    { label: 'Delivered', key: 'Delivered', icon: Package },
  ];

  const currentStatusIndex = statuses.findIndex(s => s.key === selectedOrder?.status);
  const isCancelled = selectedOrder?.status.toLowerCase() === 'cancelled';

  const handleCancelOrder = async () => {
    if (!confirm("Are you sure you want to cancel this order?")) return;
    setCancelling(true);
    try {
      await axios.put(`${backendUrl}/api/order/${selectedOrder.orderId}/cancel`);
      toast.success("Order cancelled successfully");
      setSelectedOrder(null);
      refreshOrders();
    } catch (err) {
    //   toast.error(err.response?.data?.message || "Failed to cancel");
      console.log(err.response?.data?.message || "Failed to cancel");
    } finally {
      setCancelling(false);
    }
  };

  return (
    <div className="animate-in fade-in slide-in-from-right-6 duration-500 max-w-6xl mx-auto pb-20">
      <button
        onClick={() => setSelectedOrder(null)}
        className="group flex items-center gap-3 text-[10px] font-black uppercase tracking-widest mb-10 transition-colors
             text-black dark:text-zinc-400 cursor-pointer
             md:text-zinc-400 md:hover:text-black md:dark:hover:text-white"
      >
        <div
          className="p-2 rounded-full border transition-all
               border-black dark:border-white
               md:border-zinc-200 md:dark:border-zinc-800
               md:group-hover:border-black md:dark:group-hover:border-white"
        >
          <ArrowLeft size={14} />
        </div>
        Back to Order History
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-2 flex lg:flex-col items-center lg:items-start justify-between lg:justify-start gap-8 py-4">
          {isCancelled ? (
            <div className="flex items-center gap-3 text-rose-500 font-black uppercase text-[10px] tracking-widest">
              <AlertCircle size={20} /> Order Cancelled
            </div>
          ) : (
            statuses.map((step, idx) => {
              const Icon = step.icon;
              const isCompleted = idx <= currentStatusIndex;
              const isCurrent = idx === currentStatusIndex;

              return (
                <div
                  key={step.label}
                  className="flex flex-col lg:flex-row items-center gap-3 relative"
                >
                  {/* Vertical Line Connector */}
                  {idx !== statuses.length - 1 && (
                    <div
                      className={`hidden lg:block absolute left-[15px] top-10 w-[2px] h-12 ${
                        idx < currentStatusIndex
                          ? "bg-black dark:bg-white"
                          : "bg-zinc-200 dark:bg-zinc-800"
                      }`}
                    />
                  )}

                  <div
                    className={`p-2 rounded-full border-2 transition-all duration-500 ${
                      isCompleted
                        ? "bg-black dark:bg-white text-white dark:text-black border-black dark:border-white"
                        : "border-zinc-200 dark:border-zinc-800 text-zinc-300"
                    }`}
                  >
                    <Icon size={16} />
                  </div>
                  <div className="text-center lg:text-left">
                    <p
                      className={`text-[10px] font-black uppercase tracking-tighter ${isCompleted ? "opacity-100" : "opacity-30"}`}
                    >
                      {step.label}
                    </p>
                    {isCurrent && (
                      <span className="text-[8px] text-emerald-500 font-bold animate-pulse">
                        LIVE
                      </span>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        <div className="lg:col-span-6 space-y-6">
          <div className="bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-[2.5rem] p-8">
            <h4 className="text-xl font-black dark:text-white uppercase tracking-tighter mb-8 border-b dark:border-zinc-800 pb-4">
              Items ({selectedOrder?.items?.length})
            </h4>

            <div className="space-y-8">
              {selectedOrder?.items?.map((item, i) => (
                <div key={i} className="flex gap-6 group">
                  <div className="w-24 h-32 bg-zinc-100 dark:bg-zinc-800 rounded-2xl overflow-hidden flex-shrink-0 border dark:border-zinc-700">
                    <img
                      src={item.image}
                      className="w-full h-full object-cover"
                      alt={item.name}
                    />
                  </div>
                  <div className="flex flex-col justify-between py-1 w-full">
                    <div>
                      <div className="flex justify-between items-start">
                        <h5 className="font-black text-sm dark:text-white leading-tight uppercase tracking-tighter">
                          {item.name}
                        </h5>
                        {selectedOrder.status === "Delivered" && (
                          <button
                            onClick={() => {
                              setReviewingItem(item);
                              setIsReviewModalOpen(true);
                            }}
                            className="flex items-center gap-1 text-[10px] font-black text-blue-500 hover:underline uppercase cursor-pointer"
                          >
                            <Star size={10} fill="currentColor" /> Write Review
                          </button>
                        )}
                      </div>
                      <p className="text-[10px] font-bold text-zinc-400 uppercase mt-1">
                        ₹{item.price} — Size: {item.size}
                      </p>
                    </div>

                    {/* Progress indicator for individual items if needed or just Qty */}
                    <p className="text-[10px] font-black text-zinc-500 uppercase">
                      Qty: {item.quantity}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="lg:col-span-4 space-y-6">

          {!["Shipped", "Delivered", "Cancelled"].includes(
            selectedOrder.status,
          ) && (
            <button
              disabled={cancelling}
              onClick={handleCancelOrder}
              className={`
                w-full py-4 rounded-2xl border font-black text-xs uppercase tracking-[0.2em] transition-all disabled:opacity-50 cursor-pointer
                bg-rose-500 text-white border-rose-500
                md:bg-rose-50 md:text-rose-500 md:border-rose-100
                md:dark:bg-rose-500/10 md:dark:border-rose-500/20
                md:hover:bg-rose-500 md:hover:text-white md:hover:border-rose-500
              `}
            >
              {cancelling ? "Processing..." : "Cancel Order"}
            </button>
          )}

          {/* Delivery Address Card */}
          <div className="bg-zinc-50 dark:bg-zinc-900 rounded-[2.5rem] p-8 border border-zinc-200 dark:border-zinc-800">
            <h4 className="text-xs font-black text-zinc-400 uppercase tracking-[0.2em] mb-4">
              Shipping To
            </h4>
            <div className="space-y-1">
              <p className="font-black text-sm dark:text-white uppercase">
                {selectedOrder?.orderInfo?.name}
              </p>
              <p className="text-sm text-zinc-500 leading-relaxed italic">
                {selectedOrder?.orderInfo?.street},{" "}
                {selectedOrder?.orderInfo?.city}{" "}
                {selectedOrder?.orderInfo?.pincode}
              </p>
            </div>
          </div>

          {/* Summary Card */}
          <div className="dark:bg-zinc-900 bg-zinc-50 rounded-[2.5rem] p-8 dark:text-white text-black shadow-md">
            <h4 className="text-[10px] font-black opacity-40 uppercase tracking-[0.2em] mb-6">
              Payment Summary
            </h4>
            <div className="space-y-4">
              <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest">
                <span className="opacity-60">Method</span>
                <span>{selectedOrder?.paymentInfo?.method}</span>
              </div>
              <div className="h-px bg-white/10 dark:bg-black/10 my-4" />
              <div className="flex justify-between items-end">
                <span className="text-sm font-bold opacity-60 uppercase">
                  Total
                </span>
                <span className="text-3xl font-black italic tracking-tighter">
                  ₹{selectedOrder?.totalAmount}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {isReviewModalOpen && reviewingItem && (
        <ReviewModal
          item={reviewingItem}
          onClose={() => setIsReviewModalOpen(false)}
        />
      )}
    </div>
  );
};


export const OrdersTab = () => {
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const { backendUrl, getUserData } = useContext(AppContext);

  const orderData = async () => {
    axios.defaults.withCredentials = true;
    setLoading(true);

    try {
      const { data } = await axios.get(backendUrl + "/api/order/my-orders");

      if (data.success) {
        setOrders(data.orders);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error.message || "Error in getting order data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    orderData();
  }, []);

  if (selectedOrder) {
    return <OrderModel selectedOrder={selectedOrder} setSelectedOrder={setSelectedOrder} refreshOrders={getUserData}/>
  }

  return (
    <div className="animate-in fade-in slide-in-from-bottom-6 duration-500">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
        <div>
          <h3 className="text-3xl font-black tracking-tighter dark:text-white uppercase">
            Order History
          </h3>
        </div>
      </header>

      <div className="space-y-4">
        {orders.length === 0 ? (
          <div className="text-center py-32 rounded-[3rem] border-2 border-dashed border-zinc-100 dark:border-zinc-800 flex flex-col gap-3 items-center text-black dark:text-white">
            <Package className="mx-auto opacity-10 dark:opacity-40" size={48} />
            <p className="text-zinc-400 font-medium">No Orders yet.</p>
            <div>
              <button
                onClick={() => navigate("/shop")}
                className="px-10 group flex items-center gap-3 cursor-pointer py-5 bg-zinc-900 text-white dark:bg-white dark:text-black font-black uppercase tracking-widest hover:bg-zinc-200 transition-all rounded-md"
              >
                Shop Now{" "}
                <ArrowRight
                  size={18}
                  className="group-hover:translate-x-1 transition-transform"
                />
              </button>
            </div>
          </div>
        ) :
        orders?.map((order) => (
          <div
            key={order.orderId}
            onClick={() => setSelectedOrder(order)}
            className="p-6 md:p-8 bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-[2.5rem] hover:border-zinc-400 dark:hover:border-zinc-500 hover:shadow-2xl transition-all duration-300 cursor-pointer group relative overflow-hidden"
          >
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative z-10">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8 flex-grow w-full">
                <div>
                  <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-[0.2em] mb-2">
                    Order ID
                  </p>
                  <p className="font-black text-sm dark:text-white truncate max-w-[120px]">
                    #{order.orderId}
                  </p>
                  {/* <p className="font-black text-sm dark:text-white truncate max-w-[120px]">#{order.orderId.split('-')[1]}</p> */}
                </div>

                <div>
                  <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-[0.2em] mb-2">
                    Placed On
                  </p>
                  <p className="font-bold text-sm dark:text-zinc-300">
                    {new Date(order.createdAt).toLocaleDateString("en-IN", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </p>
                </div>

                <div>
                  <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-[0.2em] mb-2">
                    Total Amount
                  </p>
                  <p className="font-black text-sm dark:text-white text-emerald-500">
                    ₹{order.totalAmount}
                  </p>
                </div>

                <div>
                  <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-[0.2em] mb-2">
                    Status
                  </p>
                  <div className="flex items-center gap-2">
                    <span
                      className={`w-2 h-2 rounded-full animate-pulse ${
                        order.status === "Processing"
                          ? "bg-amber-500"
                          : order.status === "Delivered"
                            ? "bg-green-500"
                            : "bg-blue-500"
                      }`}
                    />
                    <span className="text-[10px] font-black uppercase tracking-wider dark:text-white">
                      {order.status}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4 self-end md:self-center">
                <span
                  className="text-[10px] dark:text-white font-bold transition-opacity
                  opacity-100 md:opacity-0 md:group-hover:opacity-100"
                >
                  VIEW DETAILS
                </span>

                <div
                  className="p-3 rounded-full
                bg-black text-white dark:bg-white dark:text-black
                md:bg-zinc-50 md:text-inherit
                dark:md:bg-zinc-800
                md:group-hover:bg-black
                md:group-hover:text-white
                dark:md:group-hover:bg-white
                dark:md:group-hover:text-black
                transition-all"
                >
                  <ChevronRight size={18} />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
