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
import OrderPreview from './orderPreview.jsx';
import axios from 'axios';
import { AppContext } from '../context/AppContext.jsx';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const MOCK_ORDERS = [
  {
    id: "ORD-88291",
    date: "Oct 24, 2023",
    status: "Delivered",
    total: 124.99,
    itemsCount: 3,
    trackingNumber: "TRK99201122",
    shippingAddress: {
      name: "Alex Johnson",
      street: "123 Maple Avenue",
      city: "Portland, OR 97201",
      country: "United States"
    },
    payment: {
      method: "Visa ending in 4242",
      subtotal: 110.00,
      shipping: 10.00,
      tax: 4.99
    },
    items: [
      { id: 1, name: "Premium Wireless Headphones", price: 79.99, qty: 1, color: "Matte Black", image: "🎧" },
      { id: 2, name: "USB-C Fast Charger", price: 15.00, qty: 2, color: "White", image: "🔌" }
    ],
    timeline: [
      { status: "Order Placed", date: "Oct 20, 2023", completed: true },
      { status: "Processing", date: "Oct 21, 2023", completed: true },
      { status: "Shipped", date: "Oct 22, 2023", completed: true },
      { status: "Delivered", date: "Oct 24, 2023", completed: true }
    ]
  },
  {
    id: "ORD-88104",
    date: "Oct 28, 2023",
    status: "In Transit",
    total: 245.50,
    itemsCount: 1,
    trackingNumber: "TRK77210045",
    shippingAddress: {
      name: "Alex Johnson",
      street: "123 Maple Avenue",
      city: "Portland, OR 97201",
      country: "United States"
    },
    payment: {
      method: "Apple Pay",
      subtotal: 230.00,
      shipping: 0.00,
      tax: 15.50
    },
    items: [
      { id: 3, name: "Mechanical Gaming Keyboard", price: 230.00, qty: 1, color: "RGB / Brown Switches", image: "⌨️" }
    ],
    timeline: [
      { status: "Order Placed", date: "Oct 27, 2023", completed: true },
      { status: "Processing", date: "Oct 28, 2023", completed: true },
      { status: "Shipped", date: "Oct 28, 2023", completed: true },
      { status: "In Transit", date: "Expected Oct 30", completed: false }
    ]
  },
  {
    id: "ORD-87992",
    date: "Oct 15, 2023",
    status: "Processing",
    total: 45.00,
    itemsCount: 2,
    trackingNumber: "Pending",
    shippingAddress: {
      name: "Alex Johnson",
      street: "123 Maple Avenue",
      city: "Portland, OR 97201",
      country: "United States"
    },
    payment: {
      method: "Visa ending in 4242",
      subtotal: 40.00,
      shipping: 5.00,
      tax: 0.00
    },
    items: [
      { id: 4, name: "Ergonomic Mouse Pad", price: 20.00, qty: 2, color: "Grey", image: "🖱️" }
    ],
    timeline: [
      { status: "Order Placed", date: "Oct 15, 2023", completed: true },
      { status: "Processing", date: "In Progress", completed: false },
      { status: "Shipped", date: "-", completed: false },
      { status: "Delivered", date: "-", completed: false }
    ]
  }
];

const StatusBadge = ({ status }) => {
  const styles = {
    "delivered": "bg-green-100 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800/50 capitalize",

    "In Transit": "bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800/50 capitalize",
    "shipped": "bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800/50 capitalize",

    "processing": "bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-800/50 capitalize",

    "cancelled": "bg-red-100 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800/50 capitalize",

    "pending": "bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-800/50 capitalize",
  };

  const icons = {
    "delivered": <CheckCircle2 className="w-3.5 h-3.5 mr-1" />,
    "In Transit": <Truck className="w-3.5 h-3.5 mr-1" />,
    "shipped": <Truck className="w-3.5 h-3.5 mr-1" />,
    "processing": <Clock className="w-3.5 h-3.5 mr-1" />,
    "pending": <Clock className="w-3.5 h-3.5 mr-1" />,
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${styles[status] || 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700'}`}>
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
      <div className="w-full text-gray-900 dark:text-gray-100 font-sans p-2 md:p-4 transition-colors duration-300">

      <div className={`${isPanelOpen ? 'hidden' : 'inline-block'} w-full`}>
        <header className="mb-8 flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">Your Orders</h1>
            <p className="text-gray-500 dark:text-gray-400 mt-2">Manage your recent purchases and track shipments.</p>
          </div>
        </header>

        {loading && (
          <div className="flex flex-col items-center justify-center py-24 space-y-4">
            <Loader2 className="w-12 h-12 text-amber-500 animate-spin" />
            <p className="text-gray-500 animate-pulse font-bold uppercase tracking-widest text-xs">Loading Orders...</p>
          </div>
        )}

        {/* Orders List */}
        <div className="space-y-4">
          {/* {orders.length <= 0 && (<h1>You have not any Orders</h1>)} */}
          {(!loading && orders.length === 0) && (
            <div className="flex flex-col items-center justify-center text-center py-20 px-6">
              
              <div className="bg-amber-100 text-amber-600 p-6 rounded-full mb-6">
                <ShoppingBag size={48} />
              </div>

              <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-50 mb-2">
                No Orders Yet
              </h2>

              <p className="text-gray-500 max-w-md mb-6">
                Looks like you haven’t placed any orders yet. Start exploring delicious meals and place your first order!
              </p>

              <button
                onClick={() => navigate("/")}
                className="flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white px-6 py-3 rounded-lg font-semibold transition cursor-pointer"
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
              className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-5 hover:shadow-lg dark:hover:shadow-amber-900/10 hover:border-amber-200 dark:hover:border-amber-400 transition-all cursor-pointer group flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm"
            >
              <div className="flex items-start gap-4">
                <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded-xl group-hover:bg-blue-50 dark:group-hover:bg-amber-900/30 transition-colors">
                  <ShoppingBag className="w-6 h-6 text-gray-600 dark:text-gray-400 group-hover:text-amber-600 dark:group-hover:text-amber-400" />
                </div>
                <div>
                  <div className="hidden sm:inline-block items-center gap-2 mb-1">
                    <span className="font-bold text-gray-800 dark:text-gray-200 sm:mr-2">{order?.orderId}</span>
                    <StatusBadge status={order?.status} />
                  </div>

                  <div className="sm:hidden flex items-center justify-between gap-1 mb-1">
                    <span className="flex font-bold text-gray-800 dark:text-gray-200">{order?.orderId.slice(0, 7)}..</span>
                    <StatusBadge status={order?.status} />
                  </div>

                  <p className="text-sm text-gray-500 dark:text-gray-400">{formattedDate(order)} • {(order?.items).length} item{(order?.items).length !== 1 ? 's' : ''}</p>
                </div>
              </div>
              
              <div className="flex items-center justify-between md:justify-end gap-6 border-t dark:border-gray-800 md:border-t-0 pt-4 md:pt-0">
                <div className="text-right">
                  <p className="text-xs text-gray-400 dark:text-gray-500 uppercase tracking-wider font-semibold">Total</p>
                  <p className="text-lg font-bold text-gray-900 dark:text-white">₹{order?.totalAmount.toFixed(2)}</p>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-300 dark:text-gray-700 group-hover:text-amber-500 dark:group-hover:text-amber-400 group-hover:translate-x-1 transition-all" />
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