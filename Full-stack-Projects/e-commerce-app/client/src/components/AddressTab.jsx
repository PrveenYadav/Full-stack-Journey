import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { Plus, Edit2, Trash2, X, Loader2, Home, Briefcase, MapPin, Check, Globe } from "lucide-react";
import { AppContext } from "../context/AppContext.jsx";

const AddressModal = ({
  isOpen,
  onClose,
  editingAddress,
}) => {
  const { backendUrl, getUserData, userData } = useContext(AppContext);
  const [loading, setLoading] = useState(false);

  const initialForm = {
    type: "Home",
    fullName: userData?.name || "",
    phone: userData?.phone || "",
    email: userData?.email || "",
    street: "",
    city: "",
    zip: "",
    country: "India",
  };

  const [form, setForm] = useState(initialForm);

  useEffect(() => {
    if (editingAddress) setForm(editingAddress);
    else setForm(initialForm);
  }, [editingAddress, isOpen]);

  const handleSubmit = async () => {
    try {
      setLoading(true);
      if (editingAddress) {
        await axios.put(
          `${backendUrl}/api/user/address/${editingAddress._id}`,
          form
        );
      } else {
        await axios.post(`${backendUrl}/api/user/address`, form);
      }

      await getUserData();
      onClose();
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const isFormValid = 
    form.fullName?.trim() !== "" && 
    form.phone?.trim() !== "" && 
    form.email?.trim() !== "" && 
    form.street?.trim() !== "" && 
    form.city?.trim() !== "" && 
    form.zip?.trim() !== "";

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex justify-center items-center z-[150] p-4">
      
      <div className="bg-white dark:bg-zinc-900 text-black dark:text-white p-6 md:p-10 rounded-[2rem] w-full max-w-[600px] relative shadow-2xl overflow-y-auto max-h-[90vh] border border-zinc-200 dark:border-zinc-800">
        
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-full bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors cursor-pointer"
        >
          <X size={20} className="opacity-70" />
        </button>

        <header className="mb-8">
          <h3 className="text-3xl font-bold tracking-tight">
            {editingAddress ? "Edit Address" : "Add Address"}
          </h3>
          <p className="text-sm opacity-50 mt-1">Please enter your delivery details below.</p>
        </header>

        <div className="space-y-6">

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider opacity-60 ml-1">Full Name</label>
              <input
                value={form.fullName}
                onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                className="w-full p-3.5 rounded-2xl bg-zinc-100 dark:bg-zinc-800 border-none focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider opacity-60 ml-1">Phone</label>
              <input
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className="w-full p-3.5 rounded-2xl bg-zinc-100 dark:bg-zinc-800 border-none focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <label className="text-xs font-semibold uppercase tracking-wider opacity-60 ml-1">Email Address</label>
              <input
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full p-3.5 rounded-2xl bg-zinc-100 dark:bg-zinc-800 border-none focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-zinc-100 dark:border-zinc-800 pt-6">
            <div className="space-y-2 md:col-span-2">
              <label className="text-xs font-semibold uppercase tracking-wider opacity-60 ml-1">Street / Landmark</label>
              <input
                value={form.street}
                onChange={(e) => setForm({ ...form, street: e.target.value })}
                className="w-full p-3.5 rounded-2xl bg-zinc-100 dark:bg-zinc-800 border-none focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider opacity-60 ml-1">City</label>
              <input
                value={form.city}
                onChange={(e) => setForm({ ...form, city: e.target.value })}
                className="w-full p-3.5 rounded-2xl bg-zinc-100 dark:bg-zinc-800 border-none focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider opacity-60 ml-1">ZIP/PIN Code</label>
              <input
                value={form.zip}
                onChange={(e) => setForm({ ...form, zip: e.target.value })}
                className="w-full p-3.5 rounded-2xl bg-zinc-100 dark:bg-zinc-800 border-none focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              />
            </div>
          </div>

          <div className="pt-2">
            <div className="space-y-3">
              <label className="text-xs font-semibold uppercase tracking-wider opacity-60 ml-1">Address Type</label>
              <div className="flex gap-3">
                {['Home', 'Work'].map((type) => (
                  <button
                    key={type}
                    onClick={() => setForm({ ...form, type })}
                    className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium transition-all ${
                      form.type === type 
                      ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30' 
                      : 'bg-zinc-100 dark:bg-zinc-800 opacity-70 hover:opacity-100'
                    }`}
                  >
                    {type === 'Home' ? <Home size={16} /> : <Briefcase size={16} />}
                    {type}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        <button
        //   disabled={loading}
          disabled={loading || !isFormValid}
          onClick={handleSubmit}
          className="mt-10 w-full p-4 bg-zinc-900 dark:bg-white text-white dark:text-black rounded-2xl font-bold text-lg hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:hover:scale-100 shadow-xl"
        >
          {loading ? "Saving..." : "Save Address"}
        </button>
      </div>
    </div>
  );
}

export default function AddressesTab() {
  const { backendUrl, userData, getUserData } = useContext(AppContext);
  const [loading, setLoading] = useState(false);
  const [isAddressModal, setIsAddressModal] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);

  const addresses = userData?.addresses || [];

  const deleteAddress = async (id) => {
    setLoading(true);
    await axios.delete(`${backendUrl}/api/user/address/${id}`);
    await getUserData();
  };

  const setDefault = async (id) => {
    setLoading(true);
    await axios.put(`${backendUrl}/api/user/address/default/${id}`);
    await getUserData();
  };

  return (
    <>
      <AddressModal
        isOpen={isAddressModal}
        onClose={() => setIsAddressModal(false)}
        editingAddress={editingAddress}
      />

      <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-6xl mx-auto">

        <div className="flex justify-between items-end mb-10 border-b border-zinc-100 dark:border-zinc-800 pb-6">
           <h3 className="text-3xl font-black tracking-tighter dark:text-white uppercase">
            Addresses
           </h3>
          <button
            onClick={() => {
              setEditingAddress(null);
              setIsAddressModal(true);
            }}
            className="group flex items-center gap-2 px-6 py-3 bg-zinc-900 dark:bg-white text-white dark:text-black rounded-full shadow-2xl hover:scale-105 active:scale-95 transition-all duration-300 font-bold cursor-pointer"
          >
            <Plus
              size={18}
              className="group-hover:rotate-90 transition-transform duration-300"
            />
            <span className="hidden sm:inline">Add New</span>
          </button>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-32 space-y-4">
            <Loader2
              className="animate-spin text-zinc-400"
              size={40}
              strokeWidth={1}
            />
            <p className="text-zinc-400 text-sm font-medium animate-pulse">
              Fetching your locations...
            </p>
          </div>
        ) : addresses.length === 0 ? (
          <div className="text-center py-32 rounded-[3rem] border-2 border-dashed border-zinc-100 dark:border-zinc-800">
            <MapPin className="mx-auto mb-4 opacity-10" size={48} />
            <p className="text-zinc-400 font-medium">No addresses saved yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
            {addresses.map((addr) => (
              <div
                key={addr._id}
                className={`group p-8 rounded-[2.5rem] relative transition-all duration-300 border-2 ${
                  addr.isDefault
                    ? "bg-zinc-50 dark:bg-zinc-800/30 border-zinc-900 dark:border-white shadow-2xl"
                    : "bg-white dark:bg-zinc-900/50 border-zinc-100 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 shadow-sm"
                }`}
              >
                <div className="flex justify-between items-start mb-6">
                  <div className="flex items-center gap-2">
                    <span
                      className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        addr.isDefault
                          ? "bg-zinc-900 dark:bg-white text-white dark:text-black"
                          : "bg-zinc-100 dark:bg-zinc-800 text-zinc-500"
                      }`}
                    >
                      {addr.type === "Home" ? (
                        <Home size={12} />
                      ) : (
                        <Briefcase size={12} />
                      )}
                      {addr.type}
                    </span>

                    {addr.isDefault && (
                      <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-500 bg-emerald-500/10 px-3 py-1.5 rounded-full">
                        Default
                      </span>
                    )}
                  </div>

                  <div className="flex gap-2 lg:opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <button
                      onClick={() => {
                        setEditingAddress(addr);
                        setIsAddressModal(true);
                      }}
                      className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-xl text-zinc-400 hover:text-black dark:hover:text-white transition-colors cursor-pointer"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button
                      onClick={() => deleteAddress(addr._id)}
                      className="p-2 hover:bg-rose-50 dark:hover:bg-rose-500/10 rounded-xl text-zinc-400 hover:text-rose-500 transition-colors cursor-pointer"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <h4 className="text-xl font-bold dark:text-white flex items-center gap-2">
                      {addr.fullName}
                    </h4>
                    <p className="text-zinc-500 dark:text-zinc-400 font-medium text-sm">
                      {addr.phone} · {addr.email}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800">
                    <p className="font-semibold dark:text-zinc-200 leading-relaxed">
                      {addr.street}
                    </p>
                    <div className="flex items-center gap-1.5 mt-1 text-zinc-500 font-bold uppercase tracking-widest text-[10px]">
                      <Globe size={10} />
                      <span>
                        {addr.city}, {addr.zip} • {addr.country}
                      </span>
                    </div>
                  </div>
                </div>


                {!addr.isDefault && (
                  <button
                    onClick={() => setDefault(addr._id)}
                    className="mt-6 w-full py-3 rounded-2xl border border-zinc-200 dark:border-zinc-700 text-[10px] font-black uppercase tracking-[0.2em] hover:bg-black dark:text-white cursor-pointer hover:text-white dark:hover:bg-white dark:hover:text-black transition-all"
                  >
                    Set as Default
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
