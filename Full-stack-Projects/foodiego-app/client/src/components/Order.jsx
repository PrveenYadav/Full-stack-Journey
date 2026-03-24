import React, { useState, useEffect, useContext } from 'react';
import { 
  Package, 
  ChevronRight, 
  X, 
  Truck, 
  CheckCircle2, 
  Clock, 
  MapPin, 
  CreditCard, 
  ExternalLink,
  ShoppingBag,
  ArrowLeft,
  Sun,
  Moon,
  Loader2,
  ArrowRight
} from 'lucide-react';
import OrderPreview from './OrderPreview.jsx';
import axios from 'axios';
import { AppContext } from '../context/AppContext.jsx';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const StatusBadge = ({ status }) => {
  const styles = {
    "delivered": "bg-green-100 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800/50 capitalize",

    "In Transit": "bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800/50 capitalize",
    "shipped": "bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800/50 capitalize",

    "processing": "bg-orange-100 text-orange-700 border-orange-200 dark:bg-orange-900/30 dark:text-orange-400 dark:border-orange-800/50 capitalize",

    "cancelled": "bg-red-100 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800/50 capitalize",

    "pending": "bg-orange-100 text-orange-700 border-orange-200 dark:bg-orange-900/30 dark:text-orange-400 dark:border-orange-800/50 capitalize",
  };

  const icons = {
    "delivered": <CheckCircle2 className="w-3.5 h-3.5 mr-1" />,
    "In Transit": <Truck className="w-3.5 h-3.5 mr-1" />,
    "shipped": <Truck className="w-3.5 h-3.5 mr-1" />,
    "processing": <Clock className="w-3.5 h-3.5 mr-1" />,
    "pending": <Clock className="w-3.5 h-3.5 mr-1" />,
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${styles[status] || 'bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 dark:border-zinc-700'}`}>
      {icons[status]}
      {status}
    </span>
  );
};

export default function Order() {
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  const [orders, setOrders] = useState([]);

  const openOrder = (order) => {
    setSelectedOrder(order);
    setIsPanelOpen(true);
    // document.body.style.overflow = 'hidden';
  };

  const { backendUrl, setOrdersLength } = useContext(AppContext)

  const orderData = async () => {
    axios.defaults.withCredentials = true;
    setLoading(true)

    try {
      const {data} = await axios.get(backendUrl + "/api/order/my-orders")

      if (data.success) {
        setOrders(data.orders)
        setOrdersLength(data.count)
      } else {
        toast.error(data.message)
      }

    } catch (error) {
      console.log(error.message || "Error in getting order data")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    orderData();
  }, [])


  const formattedDate = (order) => { 
    return order?.createdAt 
    ? new Date(order.createdAt).toLocaleDateString('en-US') 
    : "Date Loading...";
  }


  return (
    <div className='h-[640px] overflow-y-scroll'>
      <div className="w-full text-zinc-900 dark:text-zinc-100 font-sans p-2 md:p-4 transition-colors duration-300">

      <div className={`${isPanelOpen ? 'hidden' : 'inline-block'} w-full`}>
        <header className="mb-8 flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-zinc-900 dark:text-white tracking-tight">Your Orders</h1>
            <p className="text-zinc-500 dark:text-zinc-400 mt-2">Manage your recent purchases and track shipments.</p>
          </div>
        </header>

        {loading && (
          <div className="flex flex-col items-center justify-center py-24 space-y-4">
            <Loader2 className="w-12 h-12 text-orange-500 animate-spin" />
            <p className="text-zinc-500 animate-pulse font-bold uppercase tracking-widest text-xs">Loading Orders...</p>
          </div>
        )}

        {/* Orders List */}
        <div className="space-y-4">
          {/* {orders.length <= 0 && (<h1>You have not any Orders</h1>)} */}
          {(!loading && orders.length === 0) && (
            <div className="flex flex-col items-center justify-center text-center py-20 px-6">
              
              <div className="bg-orange-100 text-orange-600 p-6 rounded-full mb-6">
                <ShoppingBag size={48} />
              </div>

              <h2 className="text-2xl font-bold text-zinc-800 dark:text-zinc-50 mb-2">
                No Orders Yet
              </h2>

              <p className="text-zinc-500 max-w-md mb-6">
                Looks like you haven’t placed any orders yet. Start exploring delicious meals and place your first order!
              </p>

              <button
                onClick={() => navigate("/")}
                className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg font-semibold transition cursor-pointer"
              >
                Browse Food
                <ArrowRight size={18} />
              </button>
            </div>
          )}

          {orders.length > 0 && orders.map((order) => (
            <div 
              key={order?._id}
              onClick={() => openOrder(order)}
              className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5 hover:shadow-lg dark:hover:shadow-orange-900/10 hover:border-orange-200 dark:hover:border-orange-400 transition-all cursor-pointer group flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm"
            >
              <div className="flex items-start gap-4">
                <div className="bg-zinc-100 dark:bg-zinc-800 p-3 rounded-xl group-hover:bg-blue-50 dark:group-hover:bg-orange-900/30 transition-colors">
                  <ShoppingBag className="w-6 h-6 text-zinc-600 dark:text-zinc-400 group-hover:text-orange-600 dark:group-hover:text-orange-400" />
                </div>
                <div>
                  <div className="hidden sm:inline-block items-center gap-2 mb-1">
                    <span className="font-bold text-zinc-800 dark:text-zinc-200 sm:mr-2">{order?.orderId}</span>
                    <StatusBadge status={order?.status} />
                  </div>

                  <div className="sm:hidden flex items-center justify-between gap-1 mb-1">
                    <span className="flex font-bold text-zinc-800 dark:text-zinc-200">{order?.orderId.slice(0, 7)}..</span>
                    <StatusBadge status={order?.status} />
                  </div>

                  <p className="text-sm text-zinc-500 dark:text-zinc-400">{formattedDate(order)} • {(order?.items).length} item{(order?.items).length !== 1 ? 's' : ''}</p>
                </div>
              </div>
              
              <div className="flex items-center justify-between md:justify-end gap-6 border-t dark:border-zinc-800 md:border-t-0 pt-4 md:pt-0">
                <div className="text-right">
                  <p className="text-xs text-zinc-400 dark:text-zinc-500 uppercase tracking-wider font-semibold">Total</p>
                  <p className="text-lg font-bold text-zinc-900 dark:text-white">₹{order?.totalAmount.toFixed(2)}</p>
                </div>
                <ChevronRight className="w-5 h-5 text-zinc-300 dark:text-zinc-700 group-hover:text-orange-500 dark:group-hover:text-orange-400 group-hover:translate-x-1 transition-all" />
              </div>
            </div>
          ))}
        </div>

      </div>

      <OrderPreview selectedOrder={selectedOrder} setSelectedOrder={setSelectedOrder} isPanelOpen={isPanelOpen} setIsPanelOpen={setIsPanelOpen}/>
      </div>
    </div>
  );

}
