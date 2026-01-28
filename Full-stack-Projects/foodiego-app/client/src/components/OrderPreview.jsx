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
  Circle
} from 'lucide-react';
import { RateUs } from './RateUs';
import { AppContext } from '../context/AppContext.jsx';
import { toast } from 'react-toastify';
import axios from 'axios';

const StatusBadge = ({ status }) => {
  const styles = {
    "delivered": "bg-green-100 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800/50 capitalize",

    "In Transit": "bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800/50",
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

export default function OrderPreview({selectedOrder, setSelectedOrder, isPanelOpen, setIsPanelOpen}) {
  
  const { backendUrl } = useContext(AppContext)
  const [cancelLoading, setCancelLoading] = useState(false)
  const [cancelled, setCancelled] = useState(false)

  const closeOrder = () => {
    setIsPanelOpen(false);
    // document.body.style.overflow = 'auto';
  };

  const OrderTimeline = ({ order }) => {
    // 1. Define the logical order of statuses
    const STATUS_STEPS = ["pending", "processing", "shipped", "delivered"];
    
    // 2. Find where the order currently stands
    const currentStatusIndex = STATUS_STEPS.indexOf(order?.status);

    // 3. Build the display data
    const timeline = [
      { 
        label: "Order Placed", 
        date: order?.createdAt ? new Date(order.createdAt).toLocaleDateString('en-US', { 
          month: 'short', day: 'numeric', year: 'numeric' 
        }) : "-" 
      },
      { 
        label: "Processing", 
        date: currentStatusIndex >= 1 ? "In Progress" : "-" 
      },
      { 
        label: "Shipped", 
        date: currentStatusIndex >= 2 ? "Dispatched" : "-" 
      },
      { 
        label: "Delivered", 
        date: currentStatusIndex >= 3 ? "Package Received" : "-" 
      },
    ];

    return (
      <div className="space-y-6 relative py-4">
        {timeline.map((step, idx) => {
          const isCompleted = idx <= currentStatusIndex;
          const isLast = idx === timeline.length - 1;

          return (
            <div key={idx} className="flex gap-4 relative">
              {/* The Vertical Line Connector */}
              {!isLast && (
                <div 
                  className={`absolute left-[9px] top-[22px] w-[2px] h-[calc(100%+8px)] transition-colors duration-300 ${
                    isCompleted ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-700'
                  }`} 
                />
              )}

              {/* The Status Dot */}
              <div className={`w-[20px] h-[20px] rounded-full border-4 border-white dark:border-gray-900 shadow-sm z-10 transition-colors duration-300 
                ${isCompleted ? 'bg-blue-600' : 'bg-gray-400 dark:bg-gray-600'}`} 
              />

              {/* Text Content */}
              <div className="-mt-1">
                <p className={`text-sm font-bold transition-colors duration-300 ${
                  isCompleted ? 'text-gray-900 dark:text-gray-100' : 'text-gray-400 dark:text-gray-600'
                }`}>
                  {step.label}
                </p>
                <p className="text-xs text-gray-500 mt-0.5">
                  {step.date}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  const cancelOrder = async (orderId) => {
    axios.defaults.withCredentials = true;
    setCancelLoading(true)

    try {
      const { data } = await axios.put(`${backendUrl}/api/order/${orderId}/cancel`);

      if (data.success) {
        setCancelled(true)
        toast.success(data.message)
        // fetchOrderData(); // fetch order data

        setTimeout(() => {
          window.location.reload();
        }, 2000);

      } else {
        toast.error(data.message)
      }
    } catch (error) {
      console.log(error)
      console.log(error.message || "Error in cancel the order")
      console.log(error?.response?.data?.message)
    } finally {
      setCancelLoading(false)
    }
  }

  const ButtonLoader = () => (
    <svg
      className="animate-spin h-4 w-4 text-white"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <Circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
      />
    </svg>
  );
  

  return (
    <div
      className={`${isPanelOpen ? "inline-block" : "hidden"} w-full overflow-y-scroll bg-white dark:bg-gray-900  transform transition-transform duration-300 ease-in-out  dark:border-gray-800`}
    >
      {selectedOrder && (
        <div className="h-full flex flex-col">
          <div className="p-6 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between sticky top-0 bg-white dark:bg-gray-900 z-20">
            <div>
              <button
                onClick={closeOrder}
                className="md:hidden flex items-center text-md cursor-pointer text-amber-500 dark:text-amber-400 mb-2 font-medium pb-2"
              >
                <ArrowLeft className="w-6 h-6 mr-1" /> Back
              </button>

              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                Order Details
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {selectedOrder?.orderId}
              </p>
            </div>

            <button
              onClick={closeOrder}
              className="hidden md:flex p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors cursor-pointer"
            >
              <X className="w-6 h-6 text-gray-400 dark:text-gray-600" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-8">
            <div className="bg-gray-50 dark:bg-gray-800/50 rounded-2xl p-5 border border-gray-100 dark:border-gray-800">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-tight">
                  Status
                </span>
                <StatusBadge status={selectedOrder?.status} />
              </div>

              <div>
                <OrderTimeline order={selectedOrder} />
              </div>
            </div>

            <section>
              <div className="flex items-center gap-2 mb-4">
                <ShoppingBag className="w-5 h-5 text-gray-400 dark:text-gray-600" />
                <h3 className="font-bold text-gray-900 dark:text-white">
                  Items Ordered
                </h3>
              </div>
              <div className="space-y-4">
                {selectedOrder?.items.map((item) => (
                  <div key={item?._id} className="flex gap-4">
                    <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-xl flex items-center justify-center text-2xl border dark:border-gray-700 overflow-hidden">
                      {/* {item?.image} */}
                      <img src={item?.image} alt={item?.name} />
                    </div>

                    <div className="flex-1">
                      <p className="text-sm font-bold text-gray-900 dark:text-gray-100">
                        {item?.name}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Qty: {item?.quantity} • {item?.category || ""}
                      </p>
                      <p className="text-sm font-medium mt-1 dark:text-gray-300">
                        ₹{item?.price.toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <hr className="border-gray-100 dark:border-gray-800" />

            <section className="grid grid-cols-2 gap-6">
              <div>
                <div className="flex items-center gap-2 mb-2 text-gray-400 dark:text-gray-600">
                  <MapPin className="w-4 h-4" />
                  <h4 className="text-xs font-bold uppercase">Shipping</h4>
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  <p className="font-semibold text-gray-900 dark:text-gray-200">
                    {selectedOrder?.orderInfo?.name}
                  </p>
                  <p>
                    {selectedOrder?.orderInfo?.street ||
                      selectedOrder?.orderInfo?.address}
                  </p>
                  <p>{selectedOrder?.orderInfo?.state}</p>
                  <p>{selectedOrder?.orderInfo?.city}</p>
                  <p>{selectedOrder?.orderInfo?.pincode}</p>
                </div>
              </div>
              <div>
                <div className="flex items-center gap-2 mb-2 text-gray-400 dark:text-gray-600">
                  <CreditCard className="w-4 h-4" />
                  <h4 className="text-xs font-bold uppercase">Payment</h4>
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  <p className="font-semibold text-gray-900 dark:text-gray-200">
                    {selectedOrder?.paymentInfo?.method.toUpperCase()}
                  </p>
                  {/* <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">Billed on {selectedOrder.date}</p> */}
                </div>
              </div>
            </section>

            <section className="bg-gray-50 dark:bg-gray-800/50 p-5 rounded-2xl border border-gray-100 dark:border-gray-800 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500 dark:text-gray-400">
                  Subtotal
                </span>
                {/* <span className="font-medium dark:text-gray-200">${selectedOrder?.payment.subtotal.toFixed(2)}</span> */}
                <span className="font-medium dark:text-gray-200">
                  ₹{selectedOrder?.totalAmount}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500 dark:text-gray-400">
                  Shipping
                </span>
                <span className="font-medium text-green-600 dark:text-green-400">
                  FREE
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500 dark:text-gray-400">
                  Estimated Tax
                </span>
                {/* <span className="font-medium dark:text-gray-200">${selectedOrder.payment.tax.toFixed(2)}</span> */}
                <span className="font-medium dark:text-gray-200">₹0.00</span>
              </div>
              <div className="pt-2 border-t border-gray-200 dark:border-gray-700 flex justify-between">
                <span className="font-bold text-gray-900 dark:text-white">
                  Total
                </span>
                <span className="font-bold text-gray-900 dark:text-white text-lg">
                  ₹{selectedOrder?.totalAmount.toFixed(2)}
                </span>
              </div>
            </section>
          </div>


          {selectedOrder?.status == "delivered" && (
            <RateUs
              orderStatus={selectedOrder?.status}
              selectedOrder={selectedOrder}
            />
          )}

          {(selectedOrder?.status !== "delivered" &&
            selectedOrder?.status !== "cancelled" )&& (
              <button
                onClick={() => cancelOrder(selectedOrder?.orderId)}
                disabled={cancelLoading}
                className={`${cancelled ? 'hidden' : 'inline-block'} order-1 sm:order-2 px-6 py-2.5 bg-amber-500 hover:bg-amber-600 text-white rounded-lg font-bold transition-all shadow-lg shadow-orange-100 dark:shadow-none text-sm cursor-pointer`}
              >
                {cancelLoading ? (
                  <div className="flex gap-2 items-center justify-center">
                    <ButtonLoader />
                    <span>Cancelling Order...</span>
                  </div>
                ) : (
                  "Cancel Order"
                )}
              </button>
            )}
            
        </div>
      )}
    </div>
  );
}