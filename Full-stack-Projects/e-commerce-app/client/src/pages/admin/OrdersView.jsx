import React, { useContext, useEffect, useState } from 'react';
import { Users, CheckCircle, Clock, X, Eye, MapPin, Image as ImageIcon, Search, Package, DollarSign, Globe, Activity, Trash2, CreditCard, Loader2 } from 'lucide-react';
import { AdminContext } from '../../context/AdminContext.jsx';
import axios from 'axios';
import { toast } from 'react-toastify';

// const formatPrice = (p) => `₹${p.toLocaleString('en-IN')}`;
const formatPrice = (p) => {
  if (p === undefined || p === null) return "₹0";
  return `₹${p.toLocaleString('en-IN')}`;
};

const Card = ({ children, className = "" }) => (
  <div className={`bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-[2rem] p-6 shadow-sm ${className}`}>
    {children}
  </div>
);

const Badge = ({ children, status }) => {
  const styles = {
    'Delivered': 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
    'Shipped': 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
    'Processing': 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
    'Pending': 'bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400',
    'In Stock': 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
    'Low Stock': 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
    'Out of Stock': 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400',
    'Active': 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
    'Inactive': 'bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400',
  };
  return (
    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest whitespace-nowrap ${styles[status] || styles['Pending']}`}>
      {children || status}
    </span>
  );
};

export const OrdersView = () => {
  const [activeTab, setActiveTab] = useState('All');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [orders, setOrders] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [updatingId, setUpdatingId] = useState(null); // status update loading
  
  const { backendUrl } = useContext(AdminContext)

  const fetchOrders = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/admin/orders`, {
        withCredentials: true
      });

      setOrders(data.orders); 

    } catch (err) {
      console.log(err.response?.data?.message || err.message || "Error in fetching orders");
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);


  const updateStatus = async (orderId, newStatus) => {
    try {
      const { data } = await axios.put(`${backendUrl}/api/admin/order/${orderId}`, { 
        status: newStatus 
      });

      if (data.success) {
        await fetchOrders(); // Updating status/fetching again
      } else {
        toast.error(data.message)
      }

    } catch (error) {
      console.error("Update failed", error, error?.response?.data?.message);
      toast.error(error?.response?.data?.message);
    }
  };

  const filteredOrders = orders.filter(o => {
    const matchesTab = activeTab === 'All' || o.status === activeTab;
    
    const searchLower = searchQuery.toLowerCase();
    const matchesSearch = 
      o?.orderId?.toLowerCase().includes(searchLower) ||
      o?.orderInfo?.name?.toLowerCase().includes(searchLower) ||
      o?.status?.toLowerCase().includes(searchLower);
    
    return matchesTab && matchesSearch;
  });

  // delete order
  const deleteOrder = async (id) => {
    if (!window.confirm("Are you sure you want to delete this order? This action cannot be undone.")) {
      return;
    }

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
      if (error.status === 404) {
        toast.error(error?.response?.data?.message || "Error in deleting order");
      }
    }
  }

  const handleStatusChange = async (orderId, newStatus) => {
    setUpdatingId(orderId); // Start loading for this specific id
    try {
      await updateStatus(orderId, newStatus);
    } finally {
      setUpdatingId(null); // Stop loading regardless of success/fail
    }
  };

  // console.log("selected order: ", selectedOrder)

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 relative pb-10">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h2 className="text-3xl font-black dark:text-white uppercase tracking-tighter">Order Hub</h2>
          <p className="text-zinc-500 font-bold text-sm uppercase tracking-widest mt-1">Fulfillment & lifecycle tracking</p>
        </div>

        <div className="relative w-full md:w-80 group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-black dark:group-focus-within:text-white transition-colors" size={16} />
          <input 
            type="text"
            placeholder="SEARCH NAME, ID, STATUS..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-zinc-100 dark:bg-zinc-900 dark:text-white border-2 border-transparent rounded-2xl py-3.5 pl-12 pr-4 text-[10px] font-black uppercase tracking-widest focus:bg-white dark:focus:bg-black focus:border-zinc-200 dark:focus:border-zinc-800 transition-all outline-none"
          />
        </div>
      </header>

      {/* Dashboard Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { 
            label: 'Total Orders', 
            val: orders.length, 
            icon: Package, 
            color: 'from-blue-500/20 to-blue-500/5', 
            iconColor: 'text-blue-500' 
          },
          { 
            label: 'Total Revenue', 
            val: `₹${orders.reduce((a, c) => a + c.totalAmount, 0).toLocaleString()}`, 
            icon: CreditCard, 
            color: 'from-emerald-500/20 to-emerald-500/5', 
            iconColor: 'text-emerald-500' 
          },
          { 
            label: 'Active Tasks', 
            val: orders.filter(o => o.status !== 'Delivered').length, 
            icon: Clock, 
            color: 'from-amber-500/20 to-amber-500/5', 
            iconColor: 'text-amber-500' 
          },
          { 
            label: 'Coverage', 
            val: `${new Set(orders.map(o => o?.orderInfo?.city)).size} Cities`, 
            icon: MapPin, 
            color: 'from-purple-500/20 to-purple-500/5', 
            iconColor: 'text-purple-500' 
          },
        ].map((stat, i) => (
          <div 
            key={i} 
            className="group relative overflow-hidden p-4 sm:p-6 bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-[2rem] transition-all hover:shadow-xl hover:shadow-black/5 dark:hover:shadow-none"
          >
            {/* Subtle Background Gradient Glow */}
            <div className={`absolute -right-4 -top-4 w-24 h-24 bg-gradient-to-br ${stat.color} blur-2xl opacity-0 group-hover:opacity-100 transition-opacity`} />

            <div className="relative flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <div className={`p-2 sm:p-3 rounded-2xl bg-zinc-50 dark:bg-zinc-800 ${stat.iconColor} transition-transform group-hover:scale-110`}>
                  <stat.icon size={20} strokeWidth={2.5} />
                </div>
                <span className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em]">
                  {stat.label}
                </span>
              </div>

              <div className='flex flex-row justify-between sm:inline-block'>
                <h3 className="text-xl sm:text-3xl font-black tracking-tighter text-zinc-900 dark:text-white">
                  {stat.val}
                </h3>
                <div className="mt-1 flex items-center gap-1">
                  <div className="h-1 w-8 rounded-full bg-zinc-100 dark:bg-zinc-800 overflow-hidden">
                      <div className={`h-full w-2/3 rounded-full ${stat.iconColor.replace('text', 'bg')}`} />
                  </div>
                  <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-tighter">Live Tracked</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex overflow-x-auto gap-2 pb-2 scrollbar-hide">
        {['All', 'Pending', 'Processing', 'Shipped', 'Delivered'].map(t => (
          <button 
            key={t} 
            onClick={() => setActiveTab(t)}
            className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${activeTab === t ? 'bg-black text-white dark:bg-white dark:text-black shadow-xl scale-105' : 'bg-white dark:bg-zinc-900 text-zinc-400 border border-zinc-100 dark:border-zinc-800 hover:text-black dark:hover:text-white'}`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Orders list */}
      <div className="grid grid-cols-1 gap-4">
        {filteredOrders.map(o => (
          <Card key={o._id} className="relative group border border-zinc-100 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-600 transition-all">
            <div className="flex flex-col lg:flex-row justify-between lg:items-center gap-6">
              <div className="flex items-center gap-6">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${o.status === 'Delivered' ? 'bg-emerald-50 text-emerald-500' : 'bg-zinc-100 text-zinc-400'} dark:bg-zinc-800`}>
                  {o.status === 'Delivered' ? <CheckCircle size={20}/> : <Clock size={20}/>}
                </div>
                <div>
                  <h4 className="font-black dark:text-white text-md tracking-tight">{o.orderId}</h4>
                  <p className="text-zinc-500 font-bold text-[10px] uppercase tracking-widest">{o?.orderInfo?.name} • {o?.items?.length} items</p>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 flex-grow max-w-2xl">
                <div><p className="text-[9px] font-black text-zinc-400 uppercase mb-1">Status</p><Badge status={o.status} /></div>
                <div><p className="text-[9px] font-black text-zinc-400 uppercase mb-1">Total</p><p className="font-black dark:text-white text-sm">{formatPrice(o.totalAmount)}</p></div>
                <div><p className="text-[9px] font-black text-zinc-400 uppercase mb-1">Method</p><p className="font-bold dark:text-white text-[10px] uppercase tracking-widest">{o?.paymentInfo?.method}</p></div>

                <div>
                  <p className="text-[9px] font-black text-zinc-400 uppercase mb-1">
                    {updatingId === o.orderId ? (
                      <span className="flex items-center gap-1 text-amber-500 animate-pulse">
                        <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                        Updating...
                      </span>
                    ) : (
                      "Update"
                    )}
                  </p>
                  
                  <select
                    value={o.status}
                    disabled={updatingId === o.orderId} // Disable while loading
                    onChange={(e) => handleStatusChange(o.orderId, e.target.value)}
                    className={`bg-transparent dark:bg-zinc-900 text-[10px] font-black uppercase text-zinc-900 dark:text-white outline-none cursor-pointer hover:underline ${
                      updatingId === o.orderId ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                  >
                    <option value="Processing">Processing</option>
                    <option value="Shipped">Shipped</option>
                    <option value="Delivered">Delivered</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>
                
              </div>

              <div className="flex items-center justify-end gap-2">
                <button onClick={() => setSelectedOrder(o)} className="p-3 bg-zinc-50 dark:bg-zinc-800 rounded-xl text-zinc-400 hover:text-black dark:hover:text-white transition-colors"><Eye size={18}/></button>
                
                <button 
                  onClick={() => deleteOrder(o.orderId)} 
                  className="p-3 bg-zinc-50 dark:bg-zinc-800 rounded-xl text-zinc-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-all"
                >
                  <Trash2 size={18}/>
                </button>
              </div>
            </div>
          </Card>
        ))}
      </div>
      

      {selectedOrder && (
        <div className="fixed inset-0 z-[500] flex justify-end">
          <div 
            className="absolute inset-0 bg-black/20 backdrop-blur-sm" 
            onClick={() => setSelectedOrder(null)}
          ></div>
          <div className="relative w-full max-w-md bg-white dark:bg-zinc-950 h-full p-8 shadow-2xl animate-in slide-in-from-right duration-300 overflow-y-auto">
            <button 
              onClick={() => setSelectedOrder(null)} 
              className="absolute top-8 right-8 p-2 bg-zinc-100 dark:bg-zinc-900 rounded-full hover:rotate-90 transition-transform cursor-pointer"
            >
              <X size={20} className="dark:text-white"/>
            </button>
            
            <h2 className="text-2xl font-black dark:text-white uppercase tracking-tighter mb-1">Order Details</h2>
            <p className="text-zinc-500 font-bold text-sm uppercase tracking-widest mb-8">{selectedOrder.orderId}</p>

            <div className="space-y-8">
              <div className="p-6 bg-zinc-50 dark:bg-zinc-900 rounded-3xl space-y-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-white dark:bg-black rounded-xl shadow-sm"><Users size={18} className="dark:text-white"/></div>
                  <div>
                    <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-1">Customer</p>
                    <p className="font-bold dark:text-white text-sm">{selectedOrder.orderInfo.name}</p>
                    <p className="text-xs text-zinc-500">{selectedOrder.orderInfo.email}</p>
                    <p className="text-xs text-zinc-500">{selectedOrder.orderInfo.phone}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-3 bg-white dark:bg-black rounded-xl shadow-sm"><MapPin size={18} className="dark:text-white"/></div>
                  <div>
                    <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-1">Shipping Address</p>
                    <p className="font-bold dark:text-white text-sm leading-relaxed">
                      {selectedOrder.orderInfo.street},<br />
                      {selectedOrder.orderInfo.city}, {selectedOrder.orderInfo.pincode}<br />
                      {selectedOrder.orderInfo.country}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-3 bg-white dark:bg-black rounded-xl shadow-sm"><CreditCard size={18} className="dark:text-white"/></div>
                  <div>
                    <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-1">Payment Method</p>
                    <p className="font-bold dark:text-white text-xs uppercase tracking-widest">
                      {selectedOrder.paymentInfo.method} — 
                      <span className={selectedOrder.paymentInfo.status === 'Pending' ? 'text-amber-500' : 'text-emerald-500'}>
                        {" "}{selectedOrder.paymentInfo.status}
                      </span>
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-black dark:text-white uppercase tracking-widest text-[10px] mb-5 flex items-center gap-2">
                  Items Ordered <span className="px-2 py-0.5 bg-zinc-100 dark:bg-zinc-800 rounded-full text-[9px]">{selectedOrder.items.length}</span>
                </h4>
                <div className="space-y-5">
                  {selectedOrder.items.map((item, idx) => (
                    <div key={idx} className="flex gap-4 items-center group">
                      <div className="w-16 h-20 rounded-2xl bg-zinc-100 dark:bg-zinc-800 overflow-hidden flex-shrink-0 border border-zinc-100 dark:border-zinc-800">
                        <img src={item.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt={item.name}/>
                      </div>
                      <div className="flex-grow">
                        <p className="font-black dark:text-white text-sm leading-tight mb-1">{item.name}</p>
                        <div className="flex items-center gap-2">
                          <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-tighter">Qty: {item.quantity}</p>
                          <span className="text-zinc-300">•</span>
                          <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-tighter">Size: {item.size}</p>
                        </div>
                      </div>
                      <p className="font-black dark:text-white text-sm">{formatPrice(item.price * item.quantity)}</p>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="pt-6 border-t-2 border-dashed dark:border-zinc-800">
                <div className="flex justify-between items-center mb-1">
                  <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Subtotal</p>
                  <p className="font-bold dark:text-white text-sm">{formatPrice(selectedOrder.totalAmount)}</p>
                </div>
                <div className="flex justify-between items-center mb-6">
                  <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Shipping</p>
                  <p className="font-bold text-emerald-500 text-sm uppercase">Free</p>
                </div>
                <div className="flex justify-between items-center bg-black dark:bg-white p-5 rounded-2xl">
                  <p className="font-black text-white dark:text-black uppercase tracking-widest text-xs">Total Amount</p>
                  <p className="text-xl font-black text-white dark:text-black">{formatPrice(selectedOrder.totalAmount)}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};