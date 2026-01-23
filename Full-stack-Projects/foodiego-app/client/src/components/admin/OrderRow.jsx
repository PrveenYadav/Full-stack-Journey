import React, { useContext, useState } from 'react';
import { 
  ChevronDown, 
  ChevronUp, 
  Package, 
  User, 
  CreditCard, 
  Clock, 
  MapPin, 
  Mail,
  Copy,
  Phone,
  Loader2,
  Trash2,
} from 'lucide-react';
import { toast } from 'react-toastify';
import { AdminContext } from '../../context/AdminContext.jsx';
import axios from 'axios';

const ORDER_STATUS_OPTIONS = ['pending', 'shipped', 'processing', 'delivered', 'cancelled'];

const StatusSelect = ({ status, onStatusChange, isLoading }) => {
  const styles = {
    delivered: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 border-green-200 dark:border-green-800",
    shipped: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 border-blue-200 dark:border-blue-800",
    pending: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800",
    cancelled: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 border-red-200 dark:border-red-800",
  };

  return (
    <div className="relative group min-w-[120px]">
      {isLoading ? (
        <div className={`flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold border animate-pulse ${styles[status]}`}>
          <Loader2 className="w-3 h-3 mr-1 animate-spin" />
          Updating...
        </div>
      ) : (
        <select
          value={status}
          onChange={(e) => onStatusChange(e.target.value)}
          className={`appearance-none w-full px-2.5 py-1 rounded-full text-[10px] uppercase font-bold border cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all ${styles[status] || styles.pending}`}
        >
          {ORDER_STATUS_OPTIONS.map(opt => (
            <option key={opt} value={opt} className="bg-white dark:bg-slate-900 text-gray-900 dark:text-white uppercase">
              {opt}
            </option>
          ))}
        </select>
      )}
      {!isLoading && (
        <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none opacity-50">
          <ChevronDown className="w-3 h-3" />
        </div>
      )}
    </div>
  );
};

export const OrderRow = ({ order, onStatusUpdate, fetchOrders }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [copyStatus, setCopyStatus] = useState('Copy Address');
  const [isUpdating, setIsUpdating] = useState(false);
  const { backendUrl } = useContext(AdminContext)

  const handleStatusChange = async (newStatus) => {
    setIsUpdating(true);
    await onStatusUpdate(order.orderId, newStatus);
    setIsUpdating(false);
  };

  const handleCopy = (text) => {
    const el = document.createElement('textarea');
    el.value = text;
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
    setCopyStatus('Copied!');
    setTimeout(() => setCopyStatus('Copy Address'), 2000);
  };

  const fullAddress = `${order.orderInfo.address}, ${order.orderInfo.city}, ${order.orderInfo.state} - ${order.orderInfo.pincode}`;


  // delete order
  const deleteOrder = async (id) => {
    axios.defaults.withCredentials = true;

    try {
      const { data } = await axios.delete(`${backendUrl}/api/admin/order/${id}`)

      if (data.success) {
        toast.success(data.message)
        await fetchOrders();
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      console.log(error.message || "Error in deleting Order")
    }
  }

  return (
    <React.Fragment>
      <tr className={`hover:bg-gray-50 dark:hover:bg-slate-800/50 transition-colors border-b border-gray-100 dark:border-slate-800 ${isExpanded ? 'bg-indigo-50/30 dark:bg-indigo-900/10' : ''}`}>
        <td className="px-6 py-4 whitespace-nowrap">
          <button onClick={() => setIsExpanded(!isExpanded)} className={`p-1.5 rounded-lg transition-all ${isExpanded ? 'bg-indigo-100 dark:bg-indigo-900 text-indigo-600' : 'hover:bg-gray-200 dark:hover:bg-slate-700 text-gray-400'}`}>
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </td>
        <td className="px-6 py-4 whitespace-nowrap">
          <div className="flex flex-col">
            <span className="text-sm font-bold text-gray-900 dark:text-white tracking-tight">{order.orderId}</span>
            <span className="text-[10px] text-gray-400 dark:text-slate-500 font-mono">ID: {order._id.slice(-8)}</span>
          </div>
        </td>
        <td className="px-6 py-4 whitespace-nowrap">
          <div className="flex items-center">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center mr-3 text-white shadow-sm font-bold">
              {order.orderInfo.name.charAt(0)}
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-semibold text-gray-900 dark:text-white">{order.orderInfo.name}</span>
              <span className="text-xs text-gray-500 dark:text-slate-400">{order.orderInfo.email}</span>
            </div>
          </div>
        </td>
        <td className="px-6 py-4 whitespace-nowrap">
          <div className="flex flex-col">
            <span className="text-sm text-gray-900 dark:text-slate-200 font-bold">₹{order.totalAmount}</span>
            <span className="text-[10px] text-gray-400 dark:text-slate-500 uppercase tracking-widest">{order.items.length} items</span>
          </div>
        </td>
        <td className="px-6 py-4 whitespace-nowrap">
          <StatusSelect status={order.status} onStatusChange={handleStatusChange} isLoading={isUpdating} />
        </td>
        <td className="px-6 py-4 whitespace-nowrap">
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center text-[10px] font-bold text-gray-400 dark:text-slate-500 uppercase tracking-tighter">
              <CreditCard className="w-3 h-3 mr-1" /> {order.paymentInfo.method}
            </div>
            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[9px] uppercase font-black border w-fit ${order.paymentInfo.status === 'paid' ? 'bg-emerald-50 text-emerald-600 border-emerald-100 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-800' : 'bg-red-50 text-red-600 border-red-100 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800'}`}>
              {order.paymentInfo.status}
            </span>
          </div>
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-xs text-gray-500 dark:text-slate-400">
          <div className="flex items-center"><Clock className="w-3 h-3 mr-1 opacity-70" /> {new Date(order.createdAt).toLocaleDateString()}</div>
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-xs text-gray-500 dark:text-slate-400">
          {/* <div className="flex items-center"><Clock className="w-3 h-3 mr-1 opacity-70" /> {new Date(order.createdAt).toLocaleDateString()}</div> */}
          <button onClick={() => deleteOrder(order.orderId)} className='cursor-pointer hover:text-red-400'><Trash2 className='w-4 h-4'/></button>
        </td>
      </tr>

      {isExpanded && (
        <tr>
          <td colSpan="7" className="px-6 py-0 bg-white dark:bg-slate-900 border-b border-gray-100 dark:border-slate-800 shadow-inner">
            <div className="py-8 animate-in fade-in slide-in-from-top-4 duration-300">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                <div className="lg:col-span-7 space-y-6">
                  <h4 className="text-xs font-black text-gray-400 dark:text-slate-500 uppercase tracking-[0.2em] flex items-center">
                    <Package className="w-4 h-4 mr-2" /> Order Breakdown
                  </h4>
                  <div className="grid gap-3">
                    {order.items.map((item) => (
                      <div key={item._id} className="group flex items-center justify-between p-4 bg-gray-50 dark:bg-slate-800/40 rounded-2xl border border-gray-100 dark:border-slate-800 hover:border-indigo-200 dark:hover:border-indigo-900 transition-all">
                        <div className="flex items-center">
                          <div className="relative">
                            <img src={item.image} alt={item.name} className="w-14 h-14 rounded-xl object-cover border border-gray-200 dark:border-slate-700" />
                            <span className="absolute -top-2 -right-2 bg-indigo-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-lg">x{item.quantity}</span>
                          </div>
                          <div className="ml-5">
                            <p className="text-sm font-bold text-gray-900 dark:text-white">{item.name}</p>
                            <p className="text-xs text-gray-400 mt-1 uppercase font-bold tracking-tighter italic">{item.category} • ₹{item.price} each</p>
                          </div>
                        </div>
                        <p className="text-sm font-black text-gray-900 dark:text-white">₹{item.price * item.quantity}</p>
                      </div>
                    ))}
                  </div>
                  <div className="p-5 bg-indigo-50/50 dark:bg-indigo-900/10 rounded-2xl border border-indigo-100 dark:border-indigo-900/30 flex justify-between items-center">
                    <span className="text-sm font-medium text-indigo-600 dark:text-indigo-400">Total Charged Amount</span>
                    <span className="text-xl font-black text-indigo-700 dark:text-indigo-300">₹{order.totalAmount}</span>
                  </div>
                </div>

                <div className="lg:col-span-5 space-y-8">
                  <div>
                    <h4 className="text-xs font-black text-gray-400 dark:text-slate-500 uppercase tracking-[0.2em] mb-4 flex items-center">
                      <User className="w-4 h-4 mr-2" /> Customer Account
                    </h4>
                    <div className="bg-gray-50 dark:bg-slate-800/40 p-5 rounded-2xl border border-gray-100 dark:border-slate-800 space-y-3">
                      <div>
                        <p className="text-[10px] font-bold text-gray-400 dark:text-slate-500 uppercase">Account Name</p>
                        <p className="text-sm font-semibold text-gray-900 dark:text-white">{order.user?.name}</p>
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-gray-400 dark:text-slate-500 uppercase">Email</p>
                        <a href={`mailto:${order.user?.email}`} className="text-sm text-indigo-600 dark:text-indigo-400 hover:underline">{order.user?.email}</a>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h4 className="text-xs font-black text-gray-400 dark:text-slate-500 uppercase tracking-[0.2em] mb-4 flex items-center">
                      <MapPin className="w-4 h-4 mr-2" /> Delivery Contact
                    </h4>
                    <div className="bg-gray-50 dark:bg-slate-800/40 p-5 rounded-2xl border border-gray-100 dark:border-slate-800 space-y-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="text-sm font-bold text-gray-900 dark:text-white">{order.orderInfo.name}</p>
                          <p className="text-sm text-gray-600 dark:text-slate-400 leading-relaxed mt-1">{fullAddress}</p>
                        </div>
                        <button onClick={() => handleCopy(fullAddress)} className="text-[10px] flex items-center gap-1 font-bold text-indigo-600 px-2 py-1 rounded bg-indigo-50 dark:bg-indigo-900/40 transition-colors">
                          <Copy className="w-3 h-3" /> {copyStatus}
                        </button>
                      </div>
                      <div className="pt-4 border-t border-gray-200 dark:border-slate-700 grid grid-cols-2 gap-4">
                        <a href={`tel:${order.orderInfo.phone}`} className="flex items-center gap-2 text-xs font-semibold text-gray-700 dark:text-slate-300 hover:text-indigo-600 transition-colors">
                          <Phone className="w-3 h-3" /> {order.orderInfo.phone || 'N/A'}
                        </a>
                        <a href={`mailto:${order.orderInfo.email}`} className="flex items-center gap-2 text-xs font-semibold text-gray-700 dark:text-slate-300 hover:text-indigo-600 transition-colors truncate">
                          <Mail className="w-3 h-3" /> {order.orderInfo.email}
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </td>
        </tr>
      )}
    </React.Fragment>
  );
};