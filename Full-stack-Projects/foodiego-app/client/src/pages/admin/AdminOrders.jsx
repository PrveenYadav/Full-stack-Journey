import React, { useState, useEffect, useContext } from 'react';
import { 
  ChevronDown, 
  ChevronUp, 
  Package, 
  User, 
  CreditCard, 
  Clock, 
  MapPin, 
  Search,
  Filter,
  CheckCircle2,
  Truck,
  AlertCircle,
  Mail,
  Copy,
  Phone,
  Info,
  Loader2,
  RefreshCcw
} from 'lucide-react';
import axios from 'axios';
import { AdminContext } from '../../context/AdminContext.jsx';
import { toast } from 'react-toastify';
import { OrderRow } from '../../components/admin/OrderRow.jsx';

const ORDER_STATUS_OPTIONS = ['pending', 'shipped', 'processing', 'delivered', 'cancelled'];

export const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const { backendUrl } = useContext(AdminContext)

  const fetchOrders = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await axios.get(`${backendUrl}/api/admin/orders`, {
        withCredentials: true
      });

      setOrders(data.orders); 

    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const updateOrderStatusOnBackend = async (orderId, newStatus) => {
    try {
      const { data } = await axios.put(`${backendUrl}/api/admin/order/${orderId}`, { 
        status: newStatus 
      });

      if (data.success) {
        await fetchOrders(); // Updating status/fetching again
      } else {
        toast.error(data.message)
      }
      // if (data.success) {
      //   setOrders(prev =>
      //     prev.map(o =>
      //       o._id === orderId ? { ...o, status: newStatus } : o
      //     )
      //   );
      // }

    } catch (error) {
      console.error("Update failed", error);
      toast.error(error?.response?.data?.message);
    }
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.orderId.toLowerCase().includes(searchTerm.toLowerCase()) || order.orderInfo.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });


  return (
    <div className="bg-white dark:bg-slate-950 p-4 md:p-8 font-sans selection:bg-indigo-100 dark:selection:bg-indigo-900/50 transition-colors">
      <div className="max-w-7xl mx-auto">
        
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-12">
          <div>
            <h1 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight flex items-center">
              Order Management
            </h1>
            <p className="text-gray-500 dark:text-slate-400 text-sm mt-2 max-w-md">Update order status, manage customer logistics, and track revenues.</p>
          </div>
          
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <button onClick={fetchOrders} className="p-2.5 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors">
              <RefreshCcw className={`w-4 h-4 text-gray-500 ${loading ? 'animate-spin' : ''}`} />
            </button>
            <div className="relative group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input 
                type="text" placeholder="Search orders..." 
                className="pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500/50 dark:text-white sm:w-64"
                value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="relative">
              <select 
                className="pl-4 pr-10 py-2.5 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl text-sm font-bold appearance-none dark:text-white"
                value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">View: All Status</option>
                {ORDER_STATUS_OPTIONS.map(opt => <option key={opt} value={opt}>{opt.toUpperCase()}</option>)}
              </select>
              <Filter className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>
          </div>

        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          {[
            { label: 'Total Orders', val: orders.length, icon: Package },
            { label: 'Total Revenue', val: `₹${orders.reduce((a,c) => a+c.totalAmount,0)}`, icon: CreditCard },
            { label: 'Active Tasks', val: orders.filter(o => o.status !== 'delivered').length, icon: Clock },
            { label: 'Coverage', val: new Set(orders.map(o => o.orderInfo.city)).size + ' Cities', icon: MapPin },
          ].map((s, i) => (
            <div key={i} className="bg-gray-50 dark:bg-slate-900/50 p-4 md:p-6 rounded-2xl border border-gray-100 dark:border-slate-800 flex items-center gap-4">
              <div className="p-2 bg-white dark:bg-slate-800 rounded-xl shadow-sm">
                <s.icon className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              </div>
              <div>
                <p className="text-[10px] font-black text-gray-400 dark:text-slate-500 uppercase tracking-widest">{s.label}</p>
                <p className="text-xl font-black text-gray-900 dark:text-white">{s.val}</p>
              </div>
            </div>
          ))}
        </div>

        {loading && orders.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 space-y-4">
            <Loader2 className="w-12 h-12 text-indigo-600 animate-spin" />
            <p className="text-gray-500 animate-pulse font-bold uppercase tracking-widest text-xs">Loading Orders...</p>
          </div>
        ) : error ? (
          <div className="bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/30 p-8 rounded-3xl text-center">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-red-900 dark:text-red-400 font-bold">API Connection Failed</h3>
            <p className="text-red-600/80 text-sm mt-2">{error}</p>
            <button onClick={fetchOrders} className="mt-6 px-6 py-2 bg-red-600 text-white rounded-full text-sm font-bold shadow-lg shadow-red-600/20">Retry Connection</button>
          </div>
        ) : (
          <div className="bg-white dark:bg-slate-950 rounded-3xl border border-gray-200 dark:border-slate-800 shadow-2xl overflow-hidden mb-12">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-gray-50/80 dark:bg-slate-900/80 backdrop-blur border-b border-gray-100 dark:border-slate-800">
                    <th className="px-6 py-5 text-[10px] font-black text-gray-400 dark:text-slate-500 uppercase tracking-[0.2em] w-10"></th>
                    <th className="px-6 py-5 text-[10px] font-black text-gray-400 dark:text-slate-500 uppercase tracking-[0.2em]">Reference</th>
                    <th className="px-6 py-5 text-[10px] font-black text-gray-400 dark:text-slate-500 uppercase tracking-[0.2em]">Customer</th>
                    <th className="px-6 py-5 text-[10px] font-black text-gray-400 dark:text-slate-500 uppercase tracking-[0.2em]">Grand Total</th>
                    <th className="px-6 py-5 text-[10px] font-black text-gray-400 dark:text-slate-500 uppercase tracking-[0.2em]">Live Status</th>
                    <th className="px-6 py-5 text-[10px] font-black text-gray-400 dark:text-slate-500 uppercase tracking-[0.2em]">Payment</th>
                    <th className="px-6 py-5 text-[10px] font-black text-gray-400 dark:text-slate-500 uppercase tracking-[0.2em]">Created</th>
                    <th className="px-6 py-5 text-[10px] font-black text-gray-400 dark:text-slate-500 uppercase tracking-[0.2em]">Delete</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50 dark:divide-slate-900">
                  {filteredOrders.map((order) => (
                    <OrderRow key={order._id} order={order} onStatusUpdate={updateOrderStatusOnBackend} fetchOrders={fetchOrders} />
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};