import React, { useState } from 'react';
import { Plus, Search,  Trash2, Edit3, Image as ImageIcon, Upload, X } from 'lucide-react';
import { useContext } from 'react';
import { AdminContext } from '../../context/AdminContext.jsx';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useEffect } from 'react';

const formatPrice = (p) => `₹${p.toLocaleString('en-IN')}`;

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

const Modal = ({ isOpen, onClose, title, children, maxWidth = "max-w-lg" }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[400] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose}></div>
      <div className={`relative bg-white dark:bg-zinc-900 w-full ${maxWidth} rounded-3xl p-6 sm:p-8 shadow-2xl animate-in zoom-in-95 duration-200 overflow-y-auto max-h-[90vh]`}>
        <div className="flex justify-between items-center mb-6 border-b dark:border-zinc-800 pb-4">
          <h3 className="text-xl font-black tracking-tight dark:text-white uppercase">{title}</h3>
          <button onClick={onClose} className="cursor-pointer p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full dark:text-white"><X size={20} /></button>
        </div>
        {children}
      </div>
    </div>
  );
};

const SIZE_OPTIONS = ["XS", "S", "M", "L", "XL", "XXL"];
const COLOR_OPTIONS = ["Red", "Blue", "Green", "Black", "White", "Yellow", "Purple", "Orange", "Navy Blue", "Heather Grey", "Beige", "Olive Green", "Maroon", "Royal Blue", "Teal", "Lavender", "Dusty Rose", "Mustard", "Chocolate Brown", "Mint"];

const ProductForm = ({ initialData, onSubmit }) => {
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: initialData?.name || '',
    price: initialData?.price || '',
    category: initialData?.category || 'Men',
    sub: initialData?.sub || '',
    desc: initialData?.raw?.description || '',
    isNewArrival: initialData?.raw?.isNewArrival || false,
  });

  const [newImages, setNewImages] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [existingImages, setExistingImages] = useState(initialData?.raw?.images || []);

  // Groups by color, allowing individual size selection per color
  const [variantGroups, setVariantGroups] = useState(() => {
    if (initialData?.raw?.variants?.length) {
      const groups = {};
      initialData.raw.variants.forEach(v => {
        if (!groups[v.color]) groups[v.color] = { color: v.color, selectedSizes: [], stock: v.stock || 10 };
        groups[v.color].selectedSizes.push(v.size);
      });
      return Object.values(groups);
    }
    return [{ color: '', selectedSizes: [], stock: 10 }];
  });

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    setNewImages(prev => [...prev, ...files]);
    setPreviews(prev => [...prev, ...files.map(f => URL.createObjectURL(f))]);
  };

  // Variant Group Logic
  const addColorGroup = () => setVariantGroups([...variantGroups, { color: '', selectedSizes: [], stock: 10 }]);
  
  const removeColorGroup = (index) => setVariantGroups(variantGroups.filter((_, i) => i !== index));

  const updateGroup = (index, field, value) => {
    const copy = [...variantGroups];
    copy[index][field] = value;
    setVariantGroups(copy);
  };

  const toggleSize = (groupIndex, size) => {
    const copy = [...variantGroups];
    const currentSizes = copy[groupIndex].selectedSizes;
    if (currentSizes.includes(size)) {
      copy[groupIndex].selectedSizes = currentSizes.filter(s => s !== size);
    } else {
      copy[groupIndex].selectedSizes = [...currentSizes, size];
    }
    setVariantGroups(copy);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // form validation
    if (!form.name || !form.price || !form.sub) {
      return toast.error("Please fill in basic product details");
    }
    if (existingImages.length === 0 && newImages.length === 0) {
      return toast.error("Please upload at least one image");
    }
    
    // Check if any color group is empty or has no sizes
    const invalidGroup = variantGroups.find(g => !g.color || g.selectedSizes.length === 0);
    if (invalidGroup) {
      return toast.error("Each variant must have a color and at least one size selected");
    }

    try {
      setLoading(true);
      const fd = new FormData();
      fd.append("name", form.name);
      fd.append("description", form.desc);
      fd.append("price", form.price);
      fd.append("category", form.category);
      fd.append("subCategory", form.sub);
      fd.append("isNewArrival", form.isNewArrival);

      // Transform checkboxes to individual variants
      const finalVariants = [];
      variantGroups.forEach(group => {
        group.selectedSizes.forEach(size => {
          finalVariants.push({
            color: group.color,
            size: size,
            stock: Number(group.stock),
            imageIndex: 0,
          });
        });
      });

      fd.append("variants", JSON.stringify(finalVariants));
      if (initialData) fd.append("existingImages", JSON.stringify(existingImages));
      newImages.forEach((img) => fd.append("images", img));

      await onSubmit(fd);
    } catch (err) {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <label className="text-[10px] font-black uppercase text-zinc-400 tracking-widest">Product Images</label>
        <div className="grid grid-cols-4 gap-4">
          {existingImages.map((img, idx) => (
            <div key={idx} className="relative aspect-square rounded-xl overflow-hidden bg-zinc-100 dark:bg-zinc-800 group">
              <img src={img.url} className="w-full h-full object-cover" alt="" />
              <button type="button" onClick={() => setExistingImages(prev => prev.filter((_, i) => i !== idx))} className="absolute top-1 right-1 bg-black/50 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 hover:text-red-500 cursor-pointer"><X size={12} /></button>
            </div>
          ))}
          {previews.map((img, idx) => (
            <div key={idx} className="relative aspect-square rounded-xl overflow-hidden bg-zinc-100 dark:bg-zinc-800 group">
              <img src={img} className="w-full h-full object-cover" alt="" />
              <button type="button" onClick={() => {
                setNewImages(newImages.filter((_, i) => i !== idx));
                setPreviews(previews.filter((_, i) => i !== idx));
              }} className="absolute top-1 right-1 bg-black/50 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 cursor-pointer hover:text-red-500"><X size={12} /></button>
            </div>
          ))}
          <label className="aspect-square rounded-xl border-2 border-dashed border-zinc-200 dark:border-zinc-700 flex flex-col items-center justify-center cursor-pointer hover:border-black dark:hover:border-white transition-colors">
            <Upload size={20} className="text-zinc-400 mb-2" />
            <span className="text-[9px] font-black uppercase text-zinc-400">Add Img</span>
            <input type="file" multiple accept="image/*" className="hidden" onChange={handleImageUpload} />
          </label>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1">
          <label className="text-[10px] font-black uppercase text-zinc-400 tracking-widest">Name</label>
          <input required name="name" value={form.name} onChange={handleChange} className="w-full p-4 bg-zinc-50 dark:bg-zinc-800 dark:text-white rounded-xl outline-none font-bold text-sm" />
        </div>
        <div className="space-y-1">
          <label className="text-[10px] font-black uppercase text-zinc-400 tracking-widest">Sub-Category</label>
          <input required name="sub" value={form.sub} onChange={handleChange} className="w-full p-4 bg-zinc-50 dark:bg-zinc-800 dark:text-white rounded-xl outline-none font-bold text-sm" />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="space-y-1">
          <label className="text-[10px] font-black uppercase text-zinc-400 tracking-widest">Price (INR)</label>
          <input required name="price" type="number" value={form.price} onChange={handleChange} className="w-full p-4 bg-zinc-50 dark:bg-zinc-800 dark:text-white rounded-xl outline-none font-bold text-sm" />
        </div>
        <div className="space-y-1">
          <label className="text-[10px] font-black uppercase text-zinc-400 tracking-widest">Category</label>
          <select name="category" value={form.category} onChange={handleChange} className="w-full p-4 bg-zinc-50 cursor-pointer dark:bg-zinc-800 dark:text-white rounded-xl outline-none font-bold text-sm">
            <option value="Men">Men</option>
            <option value="Women">Women</option>
          </select>
        </div>
        <div className="space-y-1">
            <label className="text-[10px] font-black uppercase text-zinc-400 tracking-widest">Status</label>
            <div className="flex items-center space-x-3 w-full p-4 bg-zinc-50 dark:bg-zinc-800 rounded-xl h-[52px]">
                <input type="checkbox" id="isNewArrival" checked={form.isNewArrival} onChange={(e) => setForm({ ...form, isNewArrival: e.target.checked })} className="w-5 h-5 rounded accent-zinc-900 cursor-pointer" />
                <label htmlFor="isNewArrival" className="text-sm font-bold text-zinc-900 dark:text-white cursor-pointer select-none">New Arrival</label>
            </div>
        </div>
      </div>

      <div className="space-y-1">
        <label className="text-[10px] font-black uppercase text-zinc-400 tracking-widest">Description</label>
        <textarea name="desc" rows="3" value={form.desc} onChange={handleChange} className="w-full p-4 bg-zinc-50 dark:bg-zinc-800 dark:text-white rounded-xl outline-none font-bold text-sm resize-none" />
      </div>
        
      {/* Variants section */}
      <div className="space-y-4">
        <label className="text-[10px] font-black uppercase text-zinc-400 tracking-widest">Variants</label>
        
        {variantGroups.map((group, i) => (
          <div key={i} className="p-4 bg-zinc-50 dark:bg-zinc-900/50 rounded-2xl border border-zinc-100 dark:border-zinc-800 space-y-4">
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <input
                  list={`colors-${i}`}
                  placeholder="Color Name (e.g. Blue)"
                  value={group.color}
                  onChange={(e) => updateGroup(i, "color", e.target.value)}
                  className="w-full p-3 bg-white dark:bg-zinc-800 dark:text-white rounded-xl font-bold text-sm outline-none"
                />
                <datalist id={`colors-${i}`}>
                  {COLOR_OPTIONS.map(c => <option key={c} value={c} />)}
                </datalist>
              </div>

              <div className="w-24">
                <input
                  type="number"
                  placeholder="Qty"
                  value={group.stock}
                  onChange={(e) => updateGroup(i, "stock", e.target.value)}
                  className="w-full p-3 bg-white dark:bg-zinc-800 dark:text-white rounded-xl font-bold text-sm outline-none"
                />
              </div>

              <button type="button" onClick={() => removeColorGroup(i)} className="text-zinc-400 hover:text-red-500 cursor-pointer">
                <X size={18} />
              </button>
            </div>

            <div className="flex flex-wrap gap-2">
              {SIZE_OPTIONS.map(size => {
                const isSelected = group.selectedSizes.includes(size);
                return (
                  <button
                    key={size}
                    type="button"
                    onClick={() => toggleSize(i, size)}
                    className={`px-4 py-2 rounded-lg text-xs font-black transition-all border-2 ${
                      isSelected 
                        ? 'bg-zinc-900 dark:bg-white text-white dark:text-black border-transparent' 
                        : 'bg-transparent cursor-pointer text-zinc-400 border-zinc-200 dark:border-zinc-800'
                    }`}
                  >
                    {size}
                  </button>
                );
              })}
            </div>
          </div>
        ))}

        <button type="button" onClick={addColorGroup} className="cursor-pointer text-xs font-black text-blue-500 uppercase tracking-tighter">
          + Add Color Group
        </button>
      </div>

      <button type="submit" disabled={loading} className="cursor-pointer w-full py-4 bg-black dark:bg-white text-white dark:text-black font-black uppercase tracking-widest rounded-2xl shadow-xl hover:scale-[1.01] active:scale-95 transition-all disabled:opacity-60 flex items-center justify-center gap-3">
        {loading && <div className="w-5 h-5 border-2 border-white dark:border-black border-t-transparent rounded-full animate-spin" />}
        {loading ? "Processing..." : initialData ? "Save Changes" : "Publish Product"}
      </button>
    </form>
  );
};

export const InventoryView = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null); // Fix: State for editing
  const [products, setProducts] = useState([]);
  const { backendUrl } = useContext(AdminContext);

  const filtered = products.filter((p) => {
    const matchesSearch = p.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesCategory =
      categoryFilter === "All" || p.category === categoryFilter;
    const matchesStatus = statusFilter === "All" || p.status === statusFilter;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const fetchProducts = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/product/all`);

      const mapped = data.items?.map((p) => {
        const totalStock = p.variants.reduce((t, v) => t + v.stock, 0);
        return {
          id: p._id,
          name: p.name,
          sub: p.subCategory,
          category: p.category,
          price: p.price,
          images: p.images.map((i) => i.url),
          stock: totalStock,
          status:
            totalStock > 10
              ? "In Stock"
              : totalStock === 0
                ? "Out of Stock"
                : "Low Stock",
          raw: p,
        };
      });

      setProducts(mapped);
    } catch (error) {
      //   toast.error("Failed to fetch products");
      console.log(error.message || "Failed to fetch products");
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleSaveProduct = async (formData) => {
    try {
      if (editingProduct) {
        await axios.put(
          `${backendUrl}/api/product/update/${editingProduct.id}`,
          formData,
        );
        toast.success("Product updated");
      } else {
        await axios.post(`${backendUrl}/api/product/add`, formData);
        toast.success("Product added");
      }

      fetchProducts();
      setIsModalOpen(false);
    } catch (err) {
      if (err.status === 400) {
        toast.error(err?.response?.data?.message || "Error in Saving product");
      }
      console.log(err.message || "Error in Saving product");
    }
  };

  const deleteProduct = async (id) => {
    if (!window.confirm("Confirm deletion?")) return;
    try {
      await axios.delete(`${backendUrl}/api/product/delete/${id}`);
      toast.success("Product deleted");
      fetchProducts();
    } catch (err) {
      // toast.error("Delete failed");
      console.log(err.message || "Delete Product failed");
    }
  };

  const openEditModal = (product) => {
    setEditingProduct(product);
    setIsModalOpen(true);
  };


  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
        <div>
          <h2 className="text-3xl font-black dark:text-white uppercase tracking-tighter">Product Catalog</h2>
          <p className="text-zinc-500 font-bold text-sm uppercase tracking-widest mt-1">Manage variants and inventory levels</p>
        </div>
        <button onClick={() => { setEditingProduct(null); setIsModalOpen(true); }} className="flex items-center gap-3 px-8 py-4 bg-black dark:bg-white text-white dark:text-black font-black uppercase text-[10px] tracking-widest rounded-2xl shadow-2xl hover:scale-105 transition-transform cursor-pointer"><Plus size={18}/> New Product</button>
      </header>

      <div className="flex flex-col lg:flex-row gap-4">
        <div className="relative flex-grow">
          <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" />
          <input 
            type="text" 
            placeholder="Search products..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-4 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl outline-none dark:text-white font-bold text-sm focus:border-black dark:focus:border-white transition-colors" 
          />
        </div>
        <div className="flex gap-4 overflow-scroll">
          <select 
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-6 py-4 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl text-sm font-black uppercase tracking-widest text-zinc-500 outline-none cursor-pointer"
          >
            <option value="All">All Categories</option>
            <option value="Men">Men</option>
            <option value="Women">Women</option>
            {/* <option value="Accessories">Accessories</option> */}
          </select>

           <select 
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-6 py-4 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl text-sm font-black uppercase tracking-widest text-zinc-500 outline-none cursor-pointer"
          >
            <option value="All">All Status</option>
            <option value="In Stock">In Stock</option>
            <option value="Low Stock">Low Stock</option>
            <option value="Out of Stock">Out of Stock</option>
          </select>
        </div>
      </div>

      <Card className="overflow-hidden border-none p-0">
        <div className="overflow-x-auto max-h-screen overflow-y-scroll">
          <table className="w-full">
            <thead className="bg-zinc-50 dark:bg-zinc-800/50 sticky top-0 backdrop-brightness-0 z-10">
              <tr className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em]">
                <th className="text-left px-8 py-5">Product Info</th>
                <th className="text-left px-8 py-5">Category</th>
                <th className="text-left px-8 py-5">Status</th>
                <th className="text-left px-8 py-5">Price</th>
                <th className="text-left px-8 py-5">Stock</th>
                <th className="text-right px-8 py-5">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
              {filtered.map(p => (
                <tr key={p.id} className="group hover:bg-zinc-50/50 dark:hover:bg-zinc-800/30 transition-colors">
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-16 rounded-xl bg-zinc-100 dark:bg-zinc-800 overflow-hidden flex-shrink-0 relative">
                        <img src={p.images[0]} className="w-full h-full object-cover" alt={p.name}/>
                        {p.images.length > 1 && <div className="absolute bottom-1 right-1 bg-black/50 text-white text-[8px] px-1 rounded-sm">+{p.images.length -1}</div>}
                      </div>
                      <div>
                        <p className="font-black text-sm dark:text-white uppercase tracking-tight truncate max-w-[150px]">{p.name}</p>
                        <p className="text-[10px] font-bold text-zinc-400 uppercase mt-1">{p.sub}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <p className="font-bold text-[10px] uppercase dark:text-zinc-300 tracking-widest">{p.category}</p>
                  </td>
                  <td className="px-8 py-5"><Badge status={p.status} /></td>
                  <td className="px-8 py-5 font-black text-sm dark:text-white">{formatPrice(p.price)}</td>
                  <td className="px-8 py-5 font-bold text-sm dark:text-white">{p.stock} <span className="text-zinc-400 font-normal ml-1">pcs</span></td>
                  <td className="px-8 py-5 text-right">
                    <div className="flex justify-end gap-2 ">
                      <button onClick={() => openEditModal(p)} className="p-2 text-zinc-400 hover:text-black dark:hover:text-white cursor-pointer"><Edit3 size={18}/></button>
                      <button onClick={() => deleteProduct(p.id)} className="p-2 text-rose-300 hover:text-rose-500 cursor-pointer"><Trash2 size={18}/></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Product Form Modal (for Add & Edit) */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingProduct ? "Edit Product" : "New Product"} maxWidth="max-w-2xl">
        <ProductForm 
          initialData={editingProduct} 
          onSubmit={handleSaveProduct}
        />
      </Modal>
    </div>
  );
};
