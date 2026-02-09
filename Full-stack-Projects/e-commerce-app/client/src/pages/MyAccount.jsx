import React, { useState, useContext } from 'react';
import { X, User, ChevronRight, Heart, Trash2, Package, MapPin, LogOut, Plus, Edit2, Camera, ArrowLeft, Save, Loader2 } from 'lucide-react';
import { CartContext } from '../context/CartContext.js';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext.jsx';
import { toast } from 'react-toastify';
import { useEffect } from 'react';
import { useRef } from 'react';
import axios from 'axios';
import AddressesTab from '../components/AddressTab.jsx';
import { OrdersTab } from '../components/OrdersTab.jsx';

export const MyAccount = () => {

  const { toggleWishlist, wishlist, subTab, setSubTab, formatPrice } =  useContext(CartContext);
  const { backendUrl, setIsLoggedIn, getUserData, userData, setUserData } = useContext(AppContext);
  const navigate = useNavigate();

  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [profileData, setProfileData] = useState({
    name: "",
    email: "",
    phone: "",
    birthDate: "",
    bio: "",
  });

  const fileInputRef = useRef(null);

  useEffect(() => {
    if (userData) {
      setProfileData({
        name: userData.name || "",
        email: userData.email || "",
        phone: userData.phone || "",
        birthDate: userData.birthDate?.split("T")[0] || "",
        bio: userData.bio || "",
      });
    }
  }, [userData]);

  const handleSaveProfile = async () => {
    try {
      setIsSaving(true);
      setSaveSuccess(false);

      const { data } = await axios.put(
        `${backendUrl}/api/user/update-profile`,
        profileData,
        { withCredentials: true },
      );

      await getUserData();

      toast.success(data.message);

      // setUserData(data.user);
      setUserData((prev) => ({ ...prev, ...data.user }));

      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (error) {
      console.error("Profile update failed:", error);
      toast.error(error.response?.data?.message || "Failed to save profile");
    } finally {
      setIsSaving(false);
    }
  };

  const handleImageClick = () => fileInputRef.current?.click();
  const [isUploading, setIsUploading] = useState(false);

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const profileData = new FormData();
    profileData.append("image", file);

    try {
      setIsUploading(true);

      const { data } = await axios.post(
        `${backendUrl}/api/user/upload-profile`,
        profileData,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );

      setUserData((prev) => ({
        ...prev,
        avatar: data.profileImage,
      }));
    } catch (error) {
      console.error("Image upload failed:", error);
      alert(error.response?.data?.message || "Image upload failed");
    } finally {
      setIsUploading(false);
    }
  };

  const handleLogout = async () => {
    try {
      axios.defaults.withCredentials = true;

      const { data } = await axios.post(backendUrl + "/api/user/logout");

      if (data.success) {
        setIsLoggedIn(false);
        setUserData(null);
        toast.success(data.message || "Logout successfully");
        navigate("/");
      }
    } catch (error) {
      console.log(error);
      const message =
        error?.response?.data?.message ||
        error.message ||
        "Logout failed, please try again";
      toast.error(message);
    }
  };


  return (
    <div className="pt-28 sm:pt-32 pb-24 px-4 max-w-7xl mx-auto min-h-screen">
      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        hidden
        onChange={handleImageUpload}
        disabled={isUploading}
      />

      <div className="flex flex-col lg:flex-row gap-12">
        <div className="lg:w-1/4 space-y-2">
          <div className="flex items-center gap-4 mb-10 px-2">
            <div
              className="relative group cursor-pointer"
              onClick={handleImageClick}
            >
              <div className="w-16 h-16 rounded-full overflow-hidden bg-orange-100 dark:bg-gray-800 flex items-center justify-center border-2 dark:border-zinc-100 border-zinc-900 cursor-pointer">
                {userData?.avatar ? (
                  <img
                    src={userData.avatar}
                    alt="Profile"
                    classsName={`avatar ${isUploading ? "blur" : "w-full h-full object-cover"}`}
                  />
                ) : (
                  <User size={24} className="text-amber-500" />
                )}

                {!isUploading && (
                  <div
                    onClick={handleImageClick}
                    className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-full cursor-pointer"
                  >
                    <Camera size={24} className="text-white" />
                  </div>
                )}

                {/* spinner while uploading image */}
                {isUploading && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-full">
                    <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  </div>
                )}
              </div>

              <div className="sm:hidden absolute bottom-0 right-0 bg-zinc-200 p-1.5 rounded-full border-2 border-white dark:border-gray-900 text-black shadow-sm">
                <Camera size={10} />
              </div>
            </div>

            <div>
              <h2 className="font-black text-xl text-zinc-900 dark:text-white leading-none">
                {profileData?.name}
              </h2>
              <p className="text-[10px] text-zinc-500 font-black uppercase mt-2 tracking-widest">
                Premium Member
              </p>
            </div>
          </div>

          <div className='flex flex-row lg:flex-col lg:gap-1 overflow-x-scroll'>
              {[
              { id: "profile", icon: User, label: "Personal Info" },
              { id: "orders", icon: Package, label: "Orders" },
              { id: "addresses", icon: MapPin, label: "Addresses" },
              { id: "favorites", icon: Heart, label: "Favorites" },
              ].map((tab) => (
              <button
                  key={tab.id}
                  onClick={() => {
                  setSubTab(tab.id);
                  setSelectedOrder(null);
                  }}
                  className={`cursor-pointer w-full flex items-center gap-4 p-4 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all ${subTab === tab.id ? "bg-black dark:bg-white text-white dark:text-black shadow-lg" : "text-zinc-400 hover:text-black dark:hover:text-white hover:bg-zinc-50 dark:hover:bg-zinc-900"}`}
              >
                  <tab.icon size={16} /> {tab.label}
              </button>
              ))}
          </div>

          <button onClick={handleLogout} className="hidden cursor-pointer w-full lg:flex items-center gap-4 p-4 rounded-2xl font-black text-[10px] uppercase tracking-widest text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-all mt-8">
            <LogOut size={16} /> Logout
          </button>
        </div>

        <div className="lg:w-3/4 min-h-[500px]">

          {subTab === "profile" && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-12 gap-6">
                <h3 className="text-3xl font-black tracking-tighter dark:text-white uppercase">
                  Profile Settings
                </h3>

                <div className="mt-8 flex items-center space-x-4">
                  <button
                    onClick={handleSaveProfile}
                    disabled={isSaving}
                    className="cursor-pointer flex items-center gap-2 bg-black dark:bg-white text-white dark:text-black px-6 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest w-full sm:w-auto justify-center"
                  >
                    {isSaving ? (
                      <Loader2 className="animate-spin" size={18} />
                    ) : (
                      <span>Save Changes</span>
                    )}
                  </button>

                  {saveSuccess && (
                    <div className="flex items-center space-x-2 text-green-500 animate-in fade-in slide-in-from-left-2">
                      <CheckCircle2 size={20} />
                      <span className="font-medium">
                        Profile updated successfully!
                      </span>
                    </div>
                  )}
                </div>

              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-zinc-400 tracking-widest">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={profileData.name}
                    onChange={(e) =>
                      setProfileData({ ...profileData, name: e.target.value })
                    }
                    className="w-full p-4 bg-zinc-50 dark:bg-zinc-900 rounded-xl dark:text-white font-bold outline-none border border-transparent focus:border-black dark:focus:border-white"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-zinc-400 tracking-widest">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={profileData.email}
                    onChange={(e) =>
                      setProfileData({
                        ...profileData,
                        email: e.target.value,
                      })
                    }
                    className="w-full p-4 bg-zinc-50 dark:bg-zinc-900 rounded-xl dark:text-white font-bold outline-none border border-transparent focus:border-black dark:focus:border-white"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-zinc-400 tracking-widest">
                    Phone Number
                  </label>
                  <input
                    type="text"
                    value={profileData.phone}
                    onChange={(e) =>
                      setProfileData({
                        ...profileData,
                        phone: e.target.value,
                      })
                    }
                    className="w-full p-4 bg-zinc-50 dark:bg-zinc-900 rounded-xl dark:text-white font-bold outline-none border border-transparent focus:border-black dark:focus:border-white"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-zinc-400 tracking-widest">
                    Birth Date
                  </label>
                  <input
                    type="text"
                    value={profileData.birthDate}
                    onChange={(e) =>
                      setProfileData({
                        ...profileData,
                        birthDate: e.target.value,
                      })
                    }
                    className="w-full p-4 bg-zinc-50 dark:bg-zinc-900 rounded-xl dark:text-white font-bold outline-none border border-transparent focus:border-black dark:focus:border-white"
                  />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <label className="text-[10px] font-black uppercase text-zinc-400 tracking-widest">
                    Your Bio
                  </label>

                  <textarea
                    name="bio"
                    value={profileData.bio}
                    // onChange={handleInputChange}
                    onChange={(e) =>
                      setProfileData({
                        ...profileData,
                        bio: e.target.value,
                      })
                    }
                    rows={4}
                    placeholder="Tell us about yourself..."
                    className="w-full p-4 bg-zinc-50 dark:bg-zinc-900 rounded-xl dark:text-white font-bold outline-none border border-transparent focus:border-black dark:focus:border-white resize-none"
                  />
                </div>
              </div>
            </div>
          )}

          {subTab === "orders" && (
            <OrdersTab/>
          )}

          {selectedOrder && (
            <div className="animate-in fade-in slide-in-from-left-4 duration-300">
              <button
                onClick={() => setSelectedOrder(null)}
                className="flex items-center gap-2 text-[10px] font-black text-zinc-400 mb-8 uppercase tracking-widest"
              >
                <ArrowLeft size={14} /> Back to History
              </button>
              <div className="bg-zinc-50 dark:bg-zinc-900 rounded-[2rem] p-6 sm:p-10">
                <div className="flex flex-col sm:flex-row justify-between items-start mb-10 pb-10 border-b border-zinc-200 dark:border-zinc-800 gap-6">
                  <div>
                    <h4 className="text-2xl font-black dark:text-white uppercase tracking-tighter mb-1">
                      Order {selectedOrder.id}
                    </h4>
                    <p className="text-xs font-bold text-zinc-500">
                      Placed on {selectedOrder.date}
                    </p>
                  </div>
                  <div className="sm:text-right">
                    <p className="text-[9px] font-black text-zinc-400 uppercase tracking-widest mb-1">
                      Payment Method
                    </p>
                    <p className="font-bold text-xs dark:text-white uppercase">
                      {selectedOrder.payment}
                    </p>
                  </div>
                </div>
                <div className="space-y-8">
                  {selectedOrder.items.map((item, i) => (
                    <div
                      key={i}
                      className="flex justify-between items-center"
                    >
                      <div className="flex items-center gap-6">
                        <div className="w-16 h-20 bg-zinc-200 dark:bg-zinc-800 rounded-lg overflow-hidden">
                          <img
                            src={item.img}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <h5 className="font-black text-sm dark:text-white uppercase">
                            {item.name}
                          </h5>
                          <p className="text-[10px] font-bold text-zinc-400 uppercase mt-1">
                            {item.size} / {item.color} — Qty: {item.qty}
                          </p>
                        </div>
                      </div>
                      <p className="font-black text-sm dark:text-white">
                        {formatPrice(item.price)}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {subTab === "addresses" && (
            <AddressesTab/>
          )}

          {subTab === "favorites" && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
              <h3 className="text-3xl font-black tracking-tighter dark:text-white uppercase mb-12">
                Wishlist
              </h3>
              {wishlist.length === 0 ? (
                <div className="text-center py-20 bg-zinc-50 dark:bg-zinc-900 rounded-[2.5rem]">
                  <Heart size={48} className="mx-auto text-zinc-200 mb-6" />
                  <p className="text-zinc-400 font-bold uppercase tracking-widest text-xs">
                    No Favorites Yet
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                  {wishlist.map((p) => (
                    <div key={p._id} className="relative group">
                      <div
                        onClick={() => navigate(`/product/${p._id}`)}
                        className="aspect-[3/4] rounded-3xl overflow-hidden bg-zinc-100 dark:bg-zinc-900 cursor-pointer mb-3"
                      >
                        <img
                          src={p.image}
                          className="w-full h-full object-cover transition-transform group-hover:scale-105"
                        />
                      </div>
                      <button
                        onClick={() => toggleWishlist(p)}
                        className="absolute top-3 right-3 p-2.5 bg-white rounded-full shadow-lg z-20"
                      >
                        <Trash2 size={14} className="text-rose-500" />
                      </button>
                      <h4 className="text-xs font-black dark:text-white uppercase truncate">
                        {p.name}
                      </h4>
                      <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mt-1">
                        {formatPrice(p.price)}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

      </div>

      {/* Logout button for smaller screens */}
      <div className="md:hidden px-4 mt-6">
          <button onClick={handleLogout} className="w-full flex items-center justify-center space-x-3 px-4 py-4 rounded-2xl bg-red-50 dark:bg-red-900/10 text-red-500 font-bold transition-colors">
          <LogOut size={16} />
          <span className='text-[12px]'>Logout</span>
          </button>
      </div>

    </div>
  );
};
