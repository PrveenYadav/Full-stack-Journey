import React, { useState, useEffect, useRef, useContext } from 'react';
import { User, MapPin, CreditCard, ShoppingBag, Settings, LogOut, Bell, Heart, Edit2, Plus, Camera,
CheckCircle2, Loader2, Trash2, ShoppingCart, ChevronRight, X} from 'lucide-react';
import { CartContext } from '../context/CartContext.js';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext.jsx';
import { toast } from 'react-toastify';
import axios from 'axios';

const STORAGE_KEYS = {
  USER_DATA: 'user_data',
  ADDRESSES: 'user_addresses'
};

const DEFAULT_ADDRESSES = [
  { id: '1', type: 'Home', address: '123 Maple Street, Apartment 4B, San Francisco, CA 94105', isDefault: true },
  { id: '2', type: 'Work', address: '500 Tech Plaza, Floor 12, San Francisco, CA 94103', isDefault: false },
];

const MyAccount = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const fileInputRef = useRef(null);

  // app context data
  const { userData, setUserData } = useContext(AppContext)

  // User & Address State
  const [addresses, setAddresses] = useState(DEFAULT_ADDRESSES);
  const navigate = useNavigate()

  const { handleRemoveItem, cartItems, } = useContext(CartContext)
  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  // Load from LocalStorage on mount
  useEffect(() => {
    const savedUser = localStorage.getItem(STORAGE_KEYS.USER_DATA);
    const savedAddresses = localStorage.getItem(STORAGE_KEYS.ADDRESSES);

    if (savedUser) {
      try {
        setUserData(JSON.parse(savedUser));
      } catch (e) {
        console.error("Error parsing user data", e);
      }
    }

    if (savedAddresses) {
      try {
        setAddresses(JSON.parse(savedAddresses));
      } catch (e) {
        console.error("Error parsing addresses", e);
      }
    }
  }, []);


  const saveToLocalStorage = (key, data) => {
    localStorage.setItem(key, JSON.stringify(data));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData(prev => ({ ...prev, [name]: value }));
    if (saveSuccess) setSaveSuccess(false);
  };

  const handleImageClick = () => fileInputRef.current?.click();

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const updated = { ...userData, avatar: reader.result };
        setUserData(updated);
        saveToLocalStorage(STORAGE_KEYS.USER_DATA, updated);
      };
      reader.readAsDataURL(file);
    }
  };


  const handleSaveProfile = () => {
    setIsSaving(true);
    setTimeout(() => {
      saveToLocalStorage(STORAGE_KEYS.USER_DATA, userData);
      setIsSaving(false);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    }, 800);
  };

  const handleAddOrUpdateAddress = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const addressData = {
      type: formData.get('type'),
      address: formData.get('address'),
      isDefault: formData.get('isDefault') === 'on'
    };

    let newAddresses;
    if (editingAddress) {
      newAddresses = addresses.map(a => 
        a.id === editingAddress.id ? { ...a, ...addressData } : a
      );
    } else {
      const newAddr = { ...addressData, id: Date.now().toString() };
      newAddresses = [...addresses, newAddr];
    }

    // If this is set to default, unset others
    if (addressData.isDefault) {
      newAddresses = newAddresses.map(a => ({
        ...a,
        isDefault: a.id === (editingAddress?.id || newAddresses[newAddresses.length - 1].id)
      }));
    }

    setAddresses(newAddresses);
    saveToLocalStorage(STORAGE_KEYS.ADDRESSES, newAddresses);
    setShowAddressModal(false);
    setEditingAddress(null);
  };

  const removeAddress = (id) => {
    const newAddresses = addresses.filter(a => a.id !== id);
    // If we removed the default, set the first one as default if it exists
    if (addresses.find(a => a.id === id)?.isDefault && newAddresses.length > 0) {
      newAddresses[0].isDefault = true;
    }
    setAddresses(newAddresses);
    saveToLocalStorage(STORAGE_KEYS.ADDRESSES, newAddresses);
  };

  const setDefaultAddress = (id) => {
    const newAddresses = addresses.map(a => ({
      ...a,
      isDefault: a.id === id
    }));
    setAddresses(newAddresses);
    saveToLocalStorage(STORAGE_KEYS.ADDRESSES, newAddresses);
  };

  const orders = [
    { id: '#ORD-9921', date: 'Dec 12, 2023', status: 'Delivered', total: '$42.50', items: '2x Spicy Ramen, 1x Gyoza' },
    { id: '#ORD-9845', date: 'Nov 28, 2023', status: 'Delivered', total: '$28.00', items: '1x Margherita Pizza, 1x Coke' },
    { id: '#ORD-9712', date: 'Nov 15, 2023', status: 'Cancelled', total: '$15.20', items: '1x Caesar Salad' },
  ];

  const SidebarItem = ({ icon: Icon, label, id, badge }) => (
    <button
      onClick={() => setActiveTab(id)}
      className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200 ${
        activeTab === id 
          ? 'bg-amber-500 text-white shadow-lg shadow-orange-200 dark:shadow-none' 
          : 'text-gray-600 dark:text-gray-400 hover:bg-orange-50 dark:hover:bg-gray-800'
      }`}
    >
      <div className="flex items-center space-x-3">
        <Icon size={20} />
        <span className="font-medium">{label}</span>
      </div>
      {badge && (
        <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${activeTab === id ? 'bg-white text-amber-500' : 'bg-amber-100 text-amber-600'}`}>
          {badge}
        </span>
      )}
    </button>
  );

  const handleLogout = () => {
    localStorage.clear();
    navigate('/')
    window.location.reload();
  }


  return (
    <div className={`min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors duration-300 font-sans`}>
      <input type="file" ref={fileInputRef} onChange={handleImageChange} accept="image/*" className="hidden" />
      {/* <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        hidden
        onChange={(e) => handleImageUpload(e.target.files[0])}
      /> */}

      <div className="md:hidden bg-white dark:bg-gray-900 px-6 pt-8 pb-4 border-b border-gray-100 dark:border-gray-800">
        <div className="flex items-center space-x-4">
          <div className="relative group" onClick={handleImageClick}>
            <div className="w-16 h-16 rounded-full overflow-hidden bg-orange-100 dark:bg-gray-800 flex items-center justify-center border-2 border-amber-500 cursor-pointer">
              {userData?.avatar ? (
                <img src={userData.avatar} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <User size={24} className="text-amber-500" />
              )}
            </div>
            <div className="absolute bottom-0 right-0 bg-amber-500 p-1.5 rounded-full border-2 border-white dark:border-gray-900 text-white shadow-sm">
              <Camera size={10} />
            </div>
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">{userData?.name || 'Your Name'}</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">{userData?.email || 'Email not set'}</p>
          </div>
        </div>
      </div>

      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          
          {/* Sidebar */}
          <aside className="w-full md:w-72 shrink-0 px-4 md:px-0">

            <div className="hidden md:block p-6 bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 mb-6 text-center">
              <div className="relative inline-block group">
                <div className="w-24 h-24 rounded-full overflow-hidden bg-orange-100 dark:bg-gray-800 flex items-center justify-center border-4 border-orange-500/10 mx-auto">
                  {userData?.avatar ? (
                    <img src={userData.avatar} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <User size={40} className="text-amber-500" />
                  )}
                  <div onClick={handleImageClick} className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-full cursor-pointer">
                    <Camera size={24} className="text-white" />
                  </div>
                </div>
                <button 
                  onClick={handleImageClick}
                  className="absolute bottom-0 right-0 p-2 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-full shadow-md text-amber-500 hover:scale-110 transition-transform cursor-pointer"
                >
                  <Edit2 size={14} />
                </button>
              </div>
              <h2 className="mt-4 text-xl font-bold text-gray-900 dark:text-white">{userData.name}</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">{userData.email}</p>
              <div className="flex justify-center">
                <span className="px-3 py-1 bg-orange-100 dark:bg-orange-500/10 text-amber-600 dark:text-amber-400 text-xs font-bold rounded-full uppercase">
                  Gold Member
                </span>
              </div>
            </div>

            <nav className="flex flex-row md:flex-col overflow-x-auto md:overflow-visible space-x-2 md:space-x-0 md:space-y-1 pb-4 md:pb-0 scrollbar-hide">
              <SidebarItem icon={User} label="Profile" id="profile" />
              <SidebarItem icon={ShoppingCart} label="Cart" id="cart" badge={cartItems?.length || 0} />
              <SidebarItem icon={MapPin} label="Addresses" id="addresses" badge={addresses.length} />
              <SidebarItem icon={ShoppingBag} label="Orders" id="orders" />
              <SidebarItem icon={CreditCard} label="Payments" id="payments" />
              <SidebarItem icon={Heart} label="Favorites" id="favorites" />
              <SidebarItem icon={Settings} label="Settings" id="settings" />
              
              <div className="hidden md:block pt-4 border-t border-gray-100 dark:border-gray-800 mt-4">
                <button onClick={handleLogout} className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors cursor-pointer">
                  <LogOut size={20} />
                  <span className="font-medium">Sign Out</span>
                </button>
              </div>
            </nav>
          </aside>

          {/* Content Area */}
          <section className="flex-1">
            <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800 p-6 md:p-8 min-h-[600px]">
              
              {activeTab === 'profile' && (
                <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Personal Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-500">Full Name</label>
                      <input 
                        type="text" 
                        name="name"
                        value={userData.name} 
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-transparent focus:border-amber-500 rounded-xl outline-none transition-all text-gray-900 dark:text-white" 
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-500">Email Address</label>
                      <input 
                        type="email" 
                        name="email"
                        value={userData.email} 
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-transparent focus:border-amber-500 rounded-xl outline-none transition-all text-gray-900 dark:text-white" 
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-500">Phone Number</label>
                      <input 
                        type="tel" 
                        name="phone"
                        value={userData.phone} 
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-transparent focus:border-amber-500 rounded-xl outline-none transition-all text-gray-900 dark:text-white" 
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-500">Birth Date</label>
                      <input 
                        type="date" 
                        name="birthDate"
                        value={userData.birthDate}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-transparent focus:border-amber-500 rounded-xl outline-none transition-all text-gray-900 dark:text-white" 
                      />
                    </div>
                  </div>
                  
                  <div className="mt-8 flex items-center space-x-4">
                    <button 
                      onClick={handleSaveProfile}
                      disabled={isSaving}
                      className="px-8 py-3 bg-amber-500 text-white font-bold rounded-xl shadow-lg hover:bg-amber-600 transition-all flex items-center space-x-2 disabled:opacity-70"
                    >
                      {isSaving ? <Loader2 className="animate-spin" size={18} /> : <span>Save Changes</span>}
                    </button>
                    {saveSuccess && (
                      <div className="flex items-center space-x-2 text-green-500 animate-in fade-in slide-in-from-left-2">
                        <CheckCircle2 size={20} />
                        <span className="font-medium">Saved to local storage!</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {activeTab === 'addresses' && (
                <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Delivery Addresses</h3>
                    <button 
                      onClick={() => { setEditingAddress(null); setShowAddressModal(true); }}
                      className="flex items-center space-x-2 text-sm font-bold text-amber-500 bg-orange-50 dark:bg-amber-500/10 px-4 py-2 rounded-xl hover:bg-orange-100 transition-colors"
                    >
                      <Plus size={16} />
                      <span>Add New</span>
                    </button>
                  </div>

                  {addresses.length === 0 ? (
                    <div className="py-20 text-center">
                      <MapPin size={48} className="mx-auto text-gray-200 mb-4" />
                      <p className="text-gray-500">No addresses saved yet.</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {addresses.map((addr) => (
                        <div key={addr.id} className={`p-5 rounded-2xl border-2 transition-all ${
                          addr.isDefault 
                            ? 'border-amber-500 bg-orange-50/50 dark:bg-amber-500/5' 
                            : 'border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-800/30'
                        }`}>
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center space-x-2">
                              <MapPin size={18} className={addr.isDefault ? "text-amber-500" : "text-gray-400"} />
                              <span className="font-bold text-gray-900 dark:text-white">{addr.type}</span>
                            </div>
                            {addr.isDefault && (
                              <span className="text-[10px] font-bold bg-amber-500 text-white px-2 py-0.5 rounded-full uppercase">DEFAULT</span>
                            )}
                          </div>
                          <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
                            {addr.address}
                          </p>
                          <div className="pt-4 border-t border-gray-100 dark:border-gray-700 flex items-center justify-between">
                            <div className="flex space-x-4">
                              <button 
                                onClick={() => { setEditingAddress(addr); setShowAddressModal(true); }}
                                className="text-xs font-bold text-amber-500 hover:underline"
                              >
                                Edit
                              </button>
                              {!addr.isDefault && (
                                <button 
                                  onClick={() => setDefaultAddress(addr.id)}
                                  className="text-xs font-bold text-gray-500 hover:text-amber-500 transition-colors"
                                >
                                  Set Default
                                </button>
                              )}
                            </div>
                            <button onClick={() => removeAddress(addr.id)} className="text-red-400 hover:text-red-600">
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'cart' && (
                <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Your Cart</h3>
                  <div className="space-y-4">
                    {cartItems.map((item) => (
                      <div key={item.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800/40 rounded-2xl border border-transparent hover:border-amber-300 transition-all">
                        <div className="flex items-center space-x-4">
                          <div className="w-16 h-16 bg-white dark:bg-gray-800 rounded-xl flex items-center justify-center text-3xl shadow-sm">
                            <img src={item.image} alt={item.title} />
                            
                          </div>
                          <div>
                            <h4 className="font-bold text-gray-900 dark:text-white">{item.name}</h4>
                            <p className="text-sm text-gray-500">Qty: {item.quantity} &bull; ₹{item.price}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-gray-900 dark:text-white">₹{(item.price * item.quantity)}</p>
                          <button onClick={() => handleRemoveItem(item.id)} className="text-xs text-red-500 font-semibold hover:underline cursor-pointer">Remove</button>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-8 p-6 bg-amber-50 dark:bg-gray-800 rounded-3xl">
                    <div className="flex justify-between mb-2">
                      <span className="text-gray-500">Subtotal</span>
                      <span className="font-bold text-gray-900 dark:text-white">₹{subtotal.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between mb-4">
                      <span className="text-gray-500">Delivery Fee</span>
                      <span className="font-bold text-green-500">FREE</span>
                    </div>
                    <div className="border-t border-amber-200 dark:border-gray-700 pt-4 flex justify-between">
                      <span className="text-xl font-bold text-gray-900 dark:text-white">Total</span>
                      <span className="text-xl font-black text-amber-500">₹{subtotal.toLocaleString()}</span>
                    </div>
                    <button onClick={() => navigate('/cart')} className="w-full mt-6 py-4 bg-amber-500 text-white font-bold rounded-2xl shadow-lg hover:bg-amber-600 transition-all flex items-center justify-center space-x-2 cursor-pointer">
                      <span>Checkout Now</span>
                      <ChevronRight size={20} />
                    </button>
                  </div>
                </div>
              )}

              {activeTab === 'orders' && (
                <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Recent Orders</h3>
                  <div className="space-y-4">
                    {orders.map((order) => (
                      <div key={order.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-5 bg-gray-50 dark:bg-gray-800/50 rounded-2xl border border-transparent hover:border-amber-200 dark:hover:border-orange-500/20 transition-all">
                        <div className="flex items-start space-x-4">
                          <div className="p-3 bg-white dark:bg-gray-800 rounded-xl shadow-sm">
                            <ShoppingBag className="text-amber-500" size={24} />
                          </div>
                          <div>
                            <div className="flex items-center space-x-2">
                              <p className="font-bold text-gray-900 dark:text-white">{order.id}</p>
                              <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                                order.status === 'Delivered' 
                                  ? 'bg-green-100 text-green-600 dark:bg-green-500/10 dark:text-green-400' 
                                  : 'bg-red-100 text-red-600 dark:bg-red-500/10 dark:text-red-400'
                              }`}>
                                {order.status}
                              </span>
                            </div>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{order.items}</p>
                            <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">{order.date}</p>
                          </div>
                        </div>
                        <div className="mt-4 sm:mt-0 flex items-center justify-between sm:block text-right">
                          <p className="text-lg font-bold text-gray-900 dark:text-white">{order.total}</p>
                          <button className="text-amber-500 text-sm font-semibold hover:underline">View Receipt</button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* which contens are not added */}
              {['favorites', 'notifications', 'settings', 'payments'].includes(activeTab) && (
                <div className="flex flex-col items-center justify-center py-20 animate-in zoom-in-95 duration-300">
                  <div className="p-6 bg-gray-50 dark:bg-gray-800 rounded-full mb-4">
                    <Settings className="text-gray-300 dark:text-gray-600" size={64} />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">This section is coming soon!</h3>
                  <button onClick={() => setActiveTab('profile')} className="mt-6 text-amber-500 font-bold hover:underline">
                    Go back to Profile
                  </button>
                </div>
              )}

            </div>
          </section>
        </div>
      </main>

      {showAddressModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-gray-900 w-full max-w-md rounded-3xl p-6 shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">{editingAddress ? 'Edit Address' : 'Add New Address'}</h3>
              <button onClick={() => setShowAddressModal(false)} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleAddOrUpdateAddress} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-500">Label (e.g. Home, Work)</label>
                <input 
                  required
                  name="type"
                  defaultValue={editingAddress?.type || ''}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border-none rounded-xl focus:ring-2 focus:ring-amber-500 outline-none text-gray-900 dark:text-white"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-500">Full Address</label>
                <textarea 
                  required
                  name="address"
                  rows="3"
                  defaultValue={editingAddress?.address || ''}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border-none rounded-xl focus:ring-2 focus:ring-amber-500 outline-none text-gray-900 dark:text-white"
                ></textarea>
              </div>
              <div className="flex items-center space-x-3 py-2">
                <input 
                  type="checkbox" 
                  name="isDefault" 
                  id="isDefault" 
                  defaultChecked={editingAddress?.isDefault}
                  className="w-5 h-5 rounded border-gray-300 text-amber-500 focus:ring-amber-500"
                />
                <label htmlFor="isDefault" className="text-sm font-medium text-gray-700 dark:text-gray-300">Set as default address</label>
              </div>
              <div className="flex space-x-3 mt-6">
                <button 
                  type="button" 
                  onClick={() => setShowAddressModal(false)}
                  className="flex-1 py-3 text-gray-500 font-bold bg-gray-100 dark:bg-gray-800 rounded-xl hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="flex-1 py-3 bg-amber-500 text-white font-bold rounded-xl hover:bg-amber-600 shadow-lg shadow-orange-200 dark:shadow-none transition-all"
                >
                  {editingAddress ? 'Update' : 'Save'} Address
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* signout button for mobile */}
      <div className="md:hidden px-4 mt-6">
        <button onClick={handleLogout} className="w-full flex items-center justify-center space-x-3 px-4 py-4 rounded-2xl bg-red-50 dark:bg-red-900/10 text-red-500 font-bold transition-colors">
          <LogOut size={20} />
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  );
};

export default MyAccount;