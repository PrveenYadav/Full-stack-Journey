import React, { useState, useMemo, useEffect, useContext } from 'react';
import { 
  LayoutDashboard, 
  UtensilsCrossed, 
  ClipboardList, 
  Users, 
  Settings, 
  TrendingUp, 
  Plus, 
  Search, 
  Bell, 
  MoreVertical,
  CheckCircle,
  Clock,
  AlertCircle,
  ChevronRight,
  LogOut,
  Menu,
  X,
  Trash2,
  Edit2,
  Filter,
  Download,
  Store,
  CreditCard,
  User,
  ShieldCheck,
  Moon,
  Sun,
  Camera,
  Check,
  RotateCcw,
  UploadCloud,
  ChevronRightIcon,
  ChevronLeft,
  Loader2,
} from 'lucide-react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { AdminOrders } from './AdminOrders.jsx';
import { AdminContext } from '../../context/AdminContext.jsx';
import { AdminReviews } from '../../components/admin/AdminReviews.jsx';

// both for creating pdf of data and then downloading
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";


const INITIAL_MENU = [
  { id: 1, name: 'Classic Burger', category: 'Burger', price: 1299, status: 'Available', description: 'Beef patty, lettuce, tomato, special sauce', images: [] },
  { id: 2, name: 'Truffle Fries', category: 'Pizza', price: 650, status: 'Available', description: 'Crispy fries with truffle oil and parmesan', images: [] },
  { id: 3, name: 'Mango Smoothie', category: 'Sandwich', price: 500, status: 'Out of Stock', description: 'Fresh alphonso mangoes blended with yogurt', images: [] },
  { id: 4, name: 'Margherita Pizza', category: 'Chowmin', price: 1400, status: 'Available', description: 'Fresh mozzarella, basil, and tomato sauce', images: [] },
];

const ORDER_STATUSES = ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];

const formatRupee = (amount) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(amount);
};

const SidebarItem = ({ icon: Icon, label, active, onClick }) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors cursor-pointer ${
      active 
        ? 'bg-amber-500 text-white shadow-md' 
        : 'text-slate-600 dark:text-slate-400 hover:bg-orange-50 dark:hover:bg-slate-800 hover:text-amber-600'
    }`}
  >
    <Icon size={20} />
    <span className="font-medium">{label}</span>
  </button>
);

const Card = ({ children, title, action, className = "" }) => (
  <div className={`bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-100 dark:border-slate-800 overflow-hidden h-full ${className}`}>
    {(title || action) && (
      <div className="px-4 sm:px-6 py-4 border-b border-slate-50 dark:border-slate-800 flex justify-between items-center">
        <h3 className="font-bold text-slate-800 dark:text-slate-100 text-sm sm:text-base">{title}</h3>
        {action}
      </div>
    )}
    <div className="p-4 sm:p-6">{children}</div>
  </div>
);

const StatusBadge = ({ status }) => {
  const styles = {
    'pending': 'bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-800',
    'processing': 'bg-amber-100 text-yellow-500 border-green-200 dark:bg-yellow-800/30 dark:text-yellow-400 dark:border-lime-700',
    // 'processing': 'bg-blue-100 text-blue-300 border-blue-200 dark:bg-blue-600/20 dark:text-blue-300 dark:border-blue-800',
    'shipped': 'bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800',
    'delivered': 'bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800',
    'cancelled': 'bg-rose-100 text-rose-700 border-rose-200 dark:bg-rose-900/30 dark:text-rose-400 dark:border-rose-800',
    'Available': 'bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800',
    'Out of Stock': 'bg-rose-100 text-rose-700 border-rose-200 dark:bg-rose-900/30 dark:text-rose-400 dark:border-rose-800',
  };
  return (
    <span className={`px-2.5 py-0.5 rounded-full text-[10px] sm:text-xs font-semibold border ${styles[status] || 'bg-slate-100 text-slate-700'}`}>
      {status}
    </span>
  );
};

const ImageSlider = ({ images }) => {
  const [index, setIndex] = useState(0);

  if (!images || images.length === 0) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-slate-100 dark:bg-slate-800">
        <UtensilsCrossed
          size={32}
          className="text-slate-200 dark:text-slate-700"
        />
      </div>
    );
  }

  const next = (e) => {
    e.stopPropagation();
    setIndex((prev) => (prev + 1) % images.length);
  };

  const prev = (e) => {
    e.stopPropagation();
    setIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const currentImage = images[index];

  return (
    <div className="relative w-full h-full group overflow-hidden">
      {/* Current Image */}
      <img
        key={currentImage.public_id}
        src={currentImage.url}
        alt="product"
        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
      />

      {images.length > 1 && (
        <>
          {/* Prev Button */}
          <button
            type="button"
            onClick={prev}
            className="absolute left-2 top-1/2 -translate-y-1/2 p-1.5 bg-black/20 hover:bg-black/40 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <ChevronLeft size={16} />
          </button>

          {/* Next Button */}
          <button
            type="button"
            onClick={next}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 bg-black/20 hover:bg-black/40 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <ChevronRightIcon size={16} />
          </button>

          {/* Dots */}
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex space-x-1.5">
            {images.map((_, i) => (
              <div
                key={i}
                className={`h-1.5 rounded-full transition-all ${
                  i === index
                    ? "w-4 bg-amber-500"
                    : "w-1.5 bg-white/50"
                }`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};



export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [menuItems, setMenuItems] = useState(INITIAL_MENU);
  const [customers, setCustomers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Admin Profile State
  const [isUploading, setIsUploading] = useState(false); // admin profile uploading
  const [adminProfile, setAdminProfile] = useState({ // admin profile default mock data
    name: "Unknown User",
    role: "Admin Manager",
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Mario"
  });
  // const [adminProfile, setAdminProfile] = useState({});

  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileForm, setProfileForm] = useState({ ...adminProfile });

  // Restaurant Info State
  const [restaurantInfo, setRestaurantInfo] = useState({
    name: "FoodieGo Central",
    email: "admin@foodiego.com",
    address: "123 Culinary Ave, Food District, NY 10001"
  });
  
  const { backendUrl, setIsAuthenticated, orders, loading, setOrders, updateOrderStatus } = useContext(AdminContext);

  const [isMenuModalOpen, setIsMenuModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [productImages, setProductImages] = useState([]); // holds new images uploading for edit product
  const [existingImages, setExistingImages] = useState([]); // existing images of products
  const [previewImages, setPreviewImages] = useState([]);   // string[]
  const [isSubmitting, setIsSubmitting] = useState(false); // for loader

  // delete menu section product
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState('');

  // saving this component page modes in local storage
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem("special-page-theme");
    return saved === "dark";
  });

  const [nutrients, setNutrients] = useState(
    editingItem?.nutrients || [{ label: "", value: "" }]
  );


  useEffect(() => {
    const saved = localStorage.getItem("special-page-theme");
    if (saved === "dark") setDarkMode(true);
  }, []);

  const toggleDarkMode = () => {
    setDarkMode((prev) => !prev);
  };

  useEffect(() => {
    localStorage.setItem(
      "special-page-theme",
      darkMode ? "dark" : "light"
    );
  }, [darkMode]);


  const totalRevenue = orders.reduce((acc, curr) => curr.status === 'delivered' ? acc + curr.totalAmount : acc, 0);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Handle mobile sidebar close on tab click
  const handleTabClick = (tab) => {
    setActiveTab(tab);
    // changeTab(tab);
    if (window.innerWidth < 1024) {
      setIsSidebarOpen(false);
    }
  };


  // --- dashboard orders and status update ---
  const getNextStatus = (currentStatus) => {
    if (currentStatus === 'pending') return 'processing';
    if (currentStatus === 'processing') return 'shipped';
    if (currentStatus === 'shipped') return 'delivered';
    return currentStatus;
  };

  const advanceOrder = (order) => {
    const nextStatus = getNextStatus(order.status);

    if (nextStatus !== order.status) {
      updateOrderStatus(order.orderId, nextStatus);
    }
  };

  const handleRestaurantInfoSave = () => {
    toast.success("Restaurant settings updated!");
  };


  // Product add and update function on form submit
  const handleMenuSubmit = async (e) => {
    e.preventDefault();
    axios.defaults.withCredentials = true;
    setIsSubmitting(true);

    try {
      const formData = new FormData();

      formData.append("name", e.target.name.value);
      formData.append("category", e.target.category.value);
      formData.append("price", e.target.price.value);
      formData.append("status", e.target.status.value);
      formData.append("description", e.target.description.value);
      formData.append("calories", e.target.calories.value || "");

      // Ingredients are string array on backend
      formData.append(
        "ingredients",
        JSON.stringify(
          e.target.ingredients.value
            .split(",")
            .map(i => i.trim())
            .filter(Boolean)
        )
      );

      formData.append(
        "nutrients",
        JSON.stringify(
          nutrients.filter(n => n.label.trim() && n.value.trim())
        )
      );

      if (editingItem) {
        formData.append(
          "existingImages",
          JSON.stringify(existingImages || [])
        );
      }

      if (productImages.length > 0) {
        productImages.forEach((file) => {
            if (file instanceof File) {
              formData.append("images", file);
            }
        });
      }

      let data;

      if (editingItem) { // update product
        const response = await axios.put(
          `${backendUrl}/api/product/update/${editingItem._id}`,
          formData
        );
        data = response.data;
      } else { // add product
        const response = await axios.post(
          `${backendUrl}/api/product/add`,
          formData
        );
        data = response.data;
      }

      if (data.success) {
        toast.success(data.message);
        fetchProductData();
        resetMenuForm();
      } else {
        toast.error(data.message);
      }

    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || "Something went wrong";
      console.error("Product submit error:", errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetMenuForm = () => {
    setIsMenuModalOpen(false);
    setEditingItem(null);
    setProductImages([]);
    setPreviewImages([]);
    setExistingImages([]);
  };

  const openEditProductModal = (product) => {
    setEditingItem(product);
    setExistingImages(product.images || []);
    setPreviewImages([]);
    setProductImages([]);
    setIsMenuModalOpen(true);
  };

  const handleProductImageUpload = (e) => {
    const files = Array.from(e.target.files);

    setProductImages(prev => [...prev, ...files]);

    const previews = files.map(file => URL.createObjectURL(file)); // preview obj url to preview
    setPreviewImages(prev => [...prev, ...previews]);

    // allow re-uploading same file
    e.target.value = null;
  };

  const removeProductImage = (index) => {
    URL.revokeObjectURL(previewImages[index]); // cleanup

    setPreviewImages(prev => prev.filter((_, i) => i !== index));
    setProductImages(prev => prev.filter((_, i) => i !== index));
  };

  // for removing existing image
  const removeExistingImage = (index) => {
    // Prevent removing last image if no new images exist
    if (existingImages.length === 1 && productImages.length === 0) {
      toast.error("At least one product image is required");
      return;
    }

    setExistingImages(prev => prev.filter((_, i) => i !== index));
  };

  // backend delete product logic
  const deleteProduct = async (id) => {
    axios.defaults.withCredentials = true

    try {
      const { data } = await axios.delete(`${backendUrl}/api/product/delete/${id}`);

      if (data.success) {
        toast.success(data.message)
        fetchProductData();
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      console.log(error.message || "Error in deleting the product item")
    }
  };

  const openDeleteModal = (id) => {
    setItemToDelete(id);
    setIsModalOpen(true);
  };

  const confirmDelete = () => {
    // setMenuItems(prev => prev.filter(item => item.id !== itemToDelete));
    deleteProduct(itemToDelete)
    setIsModalOpen(false); // Close the modal
  };

  // admin profile ---
  const handleProfileSave = () => {
    setAdminProfile({ ...profileForm });
    setIsEditingProfile(false);
    toast.success("Profile updated successfully!");
  };

  const handleProfileCancel = () => {
    setProfileForm({ ...adminProfile });
    setIsEditingProfile(false);
  };

  // fetching admin data on every refresh
  useEffect(() => {
    const fetchAdminProfile = async () => {
      try {
        const { data } = await axios.get(
          `${backendUrl}/api/admin/isAuthAdmin`,
          { withCredentials: true }
        );

        setAdminProfile({
          name: data.admin.name,
          image: data.admin.profileImage || adminProfile.image,
          email: data.admin.email,
          role: data.admin.role || adminProfile.role
        });

        // console.log("DAta inside func: ", data)

      } catch (err) {
        console.error("Failed to fetch admin profile", err);
        console.error("Failed to fetch admin profile", err.message);
      }
    };

    fetchAdminProfile();
  }, []);

  const handleProfileImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please select an image file");
      return;
    }

    // validate size (5 MB)
    const MAX_SIZE = 5 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      alert("Image must be less than 5MB");
      return;
    }

    // Create preview url
    const previewUrl = URL.createObjectURL(file);
    const previousImage = adminProfile.image;

    setAdminProfile(prev => ({ ...prev, image: previewUrl }));

    // Now upload
    const formData = new FormData();
    formData.append("image", file);

    try {
      setIsUploading(true);

      const { data } = await axios.post(
        `${backendUrl}/api/admin/upload-profile`,
        formData,
        { withCredentials: true }
      );

      setAdminProfile(prev => ({
        ...prev,
        image: data.profileImage
      }));

    } catch (err) {
      console.error("Upload failed", err);

      // Rollback preview
      setAdminProfile(prev => ({
        ...prev,
        image: previousImage
      }));

      alert("Image upload failed");
    } finally {
      // Cleanup
      URL.revokeObjectURL(previewUrl);
      setIsUploading(false);
    }
  };

  const handleLogout = async () => {
    axios.defaults.withCredentials = true;

    try {
      const {data} = await axios.post(backendUrl + '/api/admin/logout')

      if (data.success) {
        toast.success(data.message)
        setIsAuthenticated(false)
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      console.log("Error in Admin Logout", error.message)
    }
  };

  // fetching products
  const fetchProductData = async () => {
    axios.defaults.withCredentials = true;

    try {
      const {data} = await axios.get(backendUrl + '/api/product/all')

      if (data.success) {
        setMenuItems(data.items)
      }
      else {
        toast.error(data.message)
      }
    } catch (error) {
      console.log(error.message || "Error in fetching all products")
    }
  }

  useEffect(() => {
    fetchProductData();
  }, [])


  // loader using when adding/editing product
  const ButtonLoader = () => (
    <svg
      className="animate-spin h-4 w-4 text-white"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
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

  // saving the current tab in local storage
  // const changeTab = (tab) => {
  //   setActiveTab(tab);
  //   localStorage.setItem("activeTab", tab);
  // };

  // useEffect(() => {
  //   const savedTab = localStorage.getItem("activeTab");
  //   if (savedTab) {
  //     setActiveTab(savedTab);
  //   }
  // }, []);


  const [loadingCustomers, setLoadingCustomers] = useState(true)

  // customers info from backend
  const fetchCustomers = async () => {
    setLoadingCustomers(true)

    axios.defaults.withCredentials = true;

    try {
      const { data } = await axios.get(backendUrl + '/api/admin/customers')

      setCustomers(data.customers)

    } catch (error) {
      console.log(error.message || "Error in fetching customers data")
    } finally {
      setLoadingCustomers(false)
    }
  }

  useEffect(() => {
    fetchCustomers();
  }, [])


  const formatDateTime = (isoString) => {
    const date = new Date(isoString);

    return date.toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true
    });
  };


  // for downloading customers and dashboard data in pdf
  const downloadPDF = (customers) => {
    const doc = new jsPDF();

    const tableColumn = ["Name", "Email", "Total Orders", "Total Spent", "Join Date"];
    const tableRows = [];

    customers.forEach(customer => {
      const customerData = [
        // customer._id,
        customer.name,
        customer.email,
        customer.totalOrders,
        customer.totalSpent,
        new Date(customer.joinDate).toLocaleDateString()
        // customer.status
      ];
      tableRows.push(customerData);
    });

    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 20, // Start after the title
    });

    doc.text("Customer List", 14, 15);
    doc.save("customers_report.pdf");
  };

  const activeOrders = orders.filter(o => o.status !== 'delivered' && o.status !== 'cancelled').length;

  const downloadDashboardPDF = (orders, customers, totalRevenue, activeOrdersCount) => {

    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.width;

    doc.setFontSize(20);
    doc.text("Admin Dashboard Report", pageWidth / 2, 15, { align: "center" });

    doc.setFontSize(10);
    doc.text(
      `Generated on: ${new Date().toLocaleString()}`,
      pageWidth / 2,
      22,
      { align: "center" }
    );

    doc.setFontSize(12);
    doc.text("Summary", 14, 35);

    autoTable(doc, {
      startY: 40,
      theme: "grid",
      styles: { halign: "center" },
      body: [
        ["Total Revenue", `Rs. ${totalRevenue}`],
        ["Total Orders", orders.length],
        ["Active Orders", activeOrdersCount],
        ["Total Customers", customers.length]
      ]
    });

    const statusCounts = orders.reduce((acc, order) => {
      acc[order.status] = (acc[order.status] || 0) + 1;
      return acc;
    }, {});

    doc.text("Order Status Overview", 14, doc.lastAutoTable.finalY + 15);

    autoTable(doc, {
      startY: doc.lastAutoTable.finalY + 20,
      head: [["Status", "Count"]],
      body: Object.entries(statusCounts),
      theme: "striped"
    });

    doc.text("Recent Orders", 14, doc.lastAutoTable.finalY + 15);

    autoTable(doc, {
      startY: doc.lastAutoTable.finalY + 20,
      head: [["Order ID", "Customer", "Status", "Amount", "Date"]],
      body: orders.slice(0, 10).map(order => [
        order.orderId,
        order.orderInfo?.name || "N/A",
        order.status,
        `Rs. ${order.totalAmount}`,
        new Date(order.createdAt).toLocaleDateString()
      ]),
      theme: "grid",
      headStyles: { fillColor: [40, 40, 40] }
    });

    doc.setFontSize(10);
    doc.text(
      "© Admin Dashboard",
      pageWidth / 2,
      doc.internal.pageSize.height - 10,
      { align: "center" }
    );

    doc.save(`${adminProfile.name}'s_dashboard_report.pdf`);
  };


  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState('');

  const handleDeleteUser = async (id) => {
    axios.defaults.withCredentials = true;

    try {
      const { data } = await axios.delete(`${backendUrl}/api/admin/all-users/${id}`)

      if (data.success) {
        toast.success(data.message)
        fetchCustomers();
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      console.log(error.message || "Error in deleting Customer")
    }
  }

  const openDeleteModalUser = (id) => {
    setUserToDelete(id);
    setIsDeleteModalOpen(true);
  };

  const confirmDeleteUser = () => {
    handleDeleteUser(userToDelete)
    setIsDeleteModalOpen(false);
  };


  return (
    <div className={`h-screen transition-colors duration-200 ${darkMode ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'} flex font-sans overflow-hidden`}>
      
      {/* Sidebar Overlay for Mobile */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-[45] lg:hidden transition-opacity duration-300" 
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <aside className={`fixed inset-y-0 left-0 z-50 w-64 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 transform transition-transform duration-300 ease-in-out ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:relative lg:translate-x-0`}>
        <div className="flex flex-col p-6">
          <div className="flex items-center justify-between mb-10 px-2">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-amber-500 rounded-xl flex items-center justify-center text-white">
                <UtensilsCrossed size={24} />
              </div>
              <span className="text-xl font-bold tracking-tight dark:text-white">FoodieGo</span>
            </div>
            <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden p-1 text-slate-400">
              <X size={24} />
            </button>
          </div>

          <nav className="flex-1 space-y-2">
            <SidebarItem icon={LayoutDashboard} label="Dashboard" active={activeTab === 'dashboard'} onClick={() => handleTabClick('dashboard')} />
            <SidebarItem icon={ClipboardList} label="Orders" active={activeTab === 'orders'} onClick={() => handleTabClick('orders')} />
            <SidebarItem icon={UtensilsCrossed} label="Menu" active={activeTab === 'menu'} onClick={() => handleTabClick('menu')} />
            <SidebarItem icon={Users} label="Customers" active={activeTab === 'customers'} onClick={() => handleTabClick('customers')} />
            <SidebarItem icon={Users} label="Reviews" active={activeTab === 'reviews'} onClick={() => handleTabClick('reviews')} />
            <SidebarItem icon={Settings} label="Settings" active={activeTab === 'settings'} onClick={() => handleTabClick('settings')} />
          </nav>

          <div className='flex flex-col pt-6 absolute bottom-5'>
            <div className='border border-slate-100 dark:border-slate-800 w-58'></div>
            <div className="pt-6">
              <button onClick={handleLogout} className="w-full flex items-center space-x-3 px-4 py-3 text-slate-500 hover:text-orange-600 transition-colors cursor-pointer">
                <LogOut size={20} />
                <span className="font-medium">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </aside>


      <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        
        <header className="h-[8%] bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-4 lg:px-8 shrink-0">
          <div className="flex items-center space-x-3 sm:space-x-4">
            <button onClick={() => setIsSidebarOpen(true)} className="lg:hidden p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md">
              <Menu size={20} />
            </button>
            <div className="hidden md:flex items-center bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-lg w-64 lg:w-96">
              <Search size={18} className="text-slate-400" />
              <input 
                type="text" 
                placeholder="Search orders, menu..." 
                className="bg-transparent border-none focus:ring-0 text-sm ml-2 w-full dark:text-slate-200" 
                value={searchQuery} 
                onChange={(e) => setSearchQuery(e.target.value)} 
              />
            </div>
            <div className="md:hidden flex items-center text-slate-400">
               <Search size={20} />
            </div>
          </div>

          <div className="flex items-center space-x-2 sm:space-x-4">
            <button 
              // onClick={() => setDarkMode(!darkMode)}
              onClick={toggleDarkMode}
              className="p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full cursor-pointer"
            >
              {darkMode ? <Sun size={20} className="text-amber-400" /> : <Moon size={20} />}
            </button>
            <button className="p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full relative">
              <Bell size={20} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-orange-500 rounded-full border-2 border-white dark:border-slate-900"></span>
            </button>
            <div className="h-8 w-px bg-slate-200 dark:bg-slate-800 mx-1 sm:mx-2"></div>
            <div className="flex items-center space-x-2 sm:space-x-3 group relative">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-bold dark:text-slate-100">{adminProfile.name}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">{adminProfile.role}</p>
              </div>
              <div className="relative w-8 h-8 sm:w-10 sm:h-10">
                <img src={adminProfile.image} alt="Profile" className="w-full h-full rounded-full object-cover bg-slate-200 border-2 border-orange-500/20" />
                <label className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-full opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity">
                  <Camera size={12} className="text-white" />
                  <input 
                    type="file" 
                    className="hidden" 
                    accept="image/*" 
                    onChange={handleProfileImageChange} 
                    disabled={isUploading}
                  />
                  {isUploading && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-full">
                      <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    </div>
                  )}
                </label>
              </div>
            </div>
          </div>
        </header>

        {/* View Area */}
        <div className="flex-1 max-h-screen overflow-y-scroll p-4 sm:p-6 lg:p-8">
          
          {activeTab === 'dashboard' && (
            <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-500">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h1 className="text-xl sm:text-2xl font-bold dark:text-white">Dashboard Overview</h1>
                  <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">Snapshot of your restaurant's performance.</p>
                </div>
                <div className="flex gap-2">

                  <button onClick={() => downloadDashboardPDF(orders, customers, totalRevenue, activeOrders)} className="flex-1 sm:flex-none flex items-center justify-center space-x-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg text-xs sm:text-sm font-semibold transition-all shadow-sm">
                    <Download size={18} />
                    <span>Report</span>
                  </button>

                  <button onClick={() => { setEditingItem(null); setIsMenuModalOpen(true); }} className="flex-1 sm:flex-none flex items-center justify-center space-x-2 bg-amber-500 hover:bg-amber-600 text-white px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg text-xs sm:text-sm font-semibold transition-all shadow-sm">
                    <Plus size={20} />
                    <span>Add Dish</span>
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                <div className="bg-white dark:bg-slate-900 p-4 sm:p-6 rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm flex items-center space-x-4">
                  <div className="p-3 rounded-lg bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400"><TrendingUp size={24} /></div>
                  <div>
                    <p className="text-xs sm:text-sm font-medium text-slate-500 dark:text-slate-400">Today's Revenue</p>
                    <h2 className="text-lg sm:text-2xl font-bold dark:text-white">{formatRupee(totalRevenue)}</h2>
                  </div>
                </div>
                <div className="bg-white dark:bg-slate-900 p-4 sm:p-6 rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm flex items-center space-x-4">
                  <div className="p-3 rounded-lg bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400"><ClipboardList size={24} /></div>
                  <div>
                    <p className="text-xs sm:text-sm font-medium text-slate-500 dark:text-slate-400">Active Orders</p>
                    <h2 className="text-lg sm:text-2xl font-bold dark:text-white">{activeOrders}</h2>
                  </div>
                </div>
                <div className="bg-white dark:bg-slate-900 p-4 sm:p-6 rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm flex items-center space-x-4 sm:col-span-2 lg:col-span-1">
                  <div className="p-3 rounded-lg bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400"><Users size={24} /></div>
                  <div>
                    <p className="text-xs sm:text-sm font-medium text-slate-500 dark:text-slate-400">Total Customers</p>
                    <h2 className="text-lg sm:text-2xl font-bold dark:text-white">{customers.length}</h2>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
                <Card title="Live Order Queue">
                  {loading ? 
                   ( <div className="flex flex-col items-center justify-center py-24 space-y-4">
                      <Loader2 className="w-12 h-12 text-indigo-600 animate-spin" />
                      <p className="text-gray-500 animate-pulse font-bold uppercase tracking-widest text-xs">Loading Orders...</p>
                    </div>) :
                 ( <div className="space-y-4">
                    {orders.filter(o => o.status !== 'delivered' && o.status !== 'cancelled').map(order => (
                      <div key={order._id} className="flex items-center justify-between p-3 sm:p-4 border border-slate-100 dark:border-slate-800 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-all">
                          <div className="flex items-center space-x-3 sm:space-x-4">
                              <div className={`w-1 sm:w-2 h-10 sm:h-12 rounded-full ${order.status === 'pending' ? 'bg-amber-400' : 'bg-blue-400'}`}></div>
                              <div>
                                <h4 className="font-bold text-slate-800 dark:text-slate-100 text-sm">#{order.orderId} - {order.orderInfo?.name}</h4>
                                <p className="text-[10px] sm:text-xs text-slate-500 dark:text-slate-400 truncate max-w-[150px] sm:max-w-none">{order.items.length} Items • {formatDateTime(order.createdAt)}</p>
                              </div>
                          </div>
                          <div className="flex items-center space-x-2 sm:space-x-3">
                              <StatusBadge status={order.status} />
                              <button onClick={() => advanceOrder(order)} className="p-1.5 sm:p-2 bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400 rounded-lg hover:bg-orange-500 hover:text-white transition-all">
                                <CheckCircle size={16} />
                              </button>
                          </div>
                      </div>
                    ))}
                    {orders.filter(o => o.status !== 'delivered' && o.status !== 'cancelled').length === 0 && (
                      <p className="text-center text-slate-400 py-4 text-sm">No active orders right now.</p>
                    )}
                  </div>)
                  }
                          
                </Card>

                <Card title="Recent Customers">
                  { loadingCustomers ? (
                    <div className="flex flex-col items-center justify-center py-24 space-y-4">
                      <Loader2 className="w-12 h-12 text-indigo-600 animate-spin" />
                      <p className="text-gray-500 animate-pulse font-bold uppercase tracking-widest text-xs">Loading Customers...</p>
                    </div>)
                  :
                    (<div className="divide-y divide-slate-100 dark:divide-slate-800">
                      {customers?.map(c => (
                        <div key={c._id} className="py-3 flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                              <img src={`https://api.dicebear.com/7.x/initials/svg?seed=${c.name}`} className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border border-slate-200 dark:border-slate-700" alt=""/>
                              <div>
                                <p className="text-xs sm:text-sm font-bold text-slate-900 dark:text-slate-100">{c.name}</p>
                                <p className="text-[10px] sm:text-xs text-slate-500 dark:text-slate-400">{c.totalOrders} total orders</p>
                              </div>
                          </div>
                          <div className="text-right">
                              <p className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-100">{formatRupee(c.totalSpent)}</p>
                              <p className="text-[10px] text-slate-400 uppercase font-bold tracking-tight">Spent</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </Card>

              </div>
            </div>
          )}

          {activeTab == 'orders' && (
            <div>
              <AdminOrders/>
            </div>
          )}

          {activeTab === 'menu' && (
            <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
              <div className="flex justify-between items-center">
                <h1 className="text-xl sm:text-2xl font-bold dark:text-white">Menu Management</h1>
                <button 
                  onClick={() => { 
                    // resetMenuForm();
                    setEditingItem(null); 
                    setIsMenuModalOpen(true); 

                  }}
                  className="bg-amber-500 hover:bg-amber-600 text-white px-3 sm:px-4 py-2 rounded-lg font-bold flex items-center gap-2 text-sm"
                >
                  <Plus size={18}/> <span className="hidden sm:inline">Add New</span><span className="sm:hidden">Add</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {menuItems.map(item => (
                  <div key={item?._id} className="bg-white dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col group">
                    <div className="h-44 sm:h-52 bg-slate-100 dark:bg-slate-800 flex items-center justify-center relative">
                      <ImageSlider images={item?.images} />
                      <div className="absolute top-2 sm:top-3 right-2 sm:right-3"><StatusBadge status={item?.status || 'Available'}/></div>
                    </div>
                    <div className="p-4 sm:p-5 flex-1">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-bold text-slate-800 dark:text-slate-100 text-sm sm:text-base">{item?.name}</h3>
                        <span className="text-amber-500 font-bold text-sm">{formatRupee(item?.price)}</span>
                      </div>
                      <p className="text-[10px] sm:text-xs text-slate-500 dark:text-slate-400 mb-4 line-clamp-2">{item?.description}</p>
                      <div className="flex justify-between items-center pt-4 border-t border-slate-50 dark:border-slate-800">
                          <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider bg-slate-50 dark:bg-slate-800 px-2 py-1 rounded">{item?.category}</span>

                          <div className="flex space-x-1">
                            <button onClick={() => { setEditingItem(item); setProductImages(item?.images || []); setIsMenuModalOpen(true); openEditProductModal(item); }} className="p-1.5 sm:p-2 text-slate-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-all"><Edit2 size={16}/></button>

                            <button onClick={() => openDeleteModal(item._id)} className="p-1.5 sm:p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-lg transition-all"><Trash2 size={16}/></button>
                          </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="max-w-4xl mx-auto space-y-6 sm:space-y-8 animate-in fade-in duration-500">
               <h1 className="text-xl sm:text-2xl font-bold dark:text-white">Settings</h1>
               
               <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
                  <div className="md:col-span-1">
                     <h3 className="font-bold text-slate-800 dark:text-slate-200">Admin Profile</h3>
                     <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">Manage your personal branding and security.</p>
                  </div>
                  <div className="md:col-span-2 space-y-4">
                     <Card>
                        <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-6 mb-6">
                            <div className="relative group">
                                <img src={adminProfile.image} alt="Admin" className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover border-4 border-white dark:border-slate-800 shadow-md" />
                                <label className="absolute inset-0 flex flex-col items-center justify-center bg-black/50 text-white text-[10px] font-bold opacity-0 group-hover:opacity-100 rounded-2xl cursor-pointer transition-opacity">
                                    <Camera size={18} className="mb-1" />
                                    CHANGE
                                    <input type="file" className="hidden" accept="image/*" onChange={handleProfileImageChange} />
                                </label>
                            </div>
                            
                            {isEditingProfile ? (
                              <div className="flex-1 space-y-3 w-full">
                                <div className="space-y-1">
                                  <label className="text-[10px] font-bold text-slate-400 uppercase">Full Name</label>
                                  <input 
                                    type="text" 
                                    value={profileForm.name} 
                                    onChange={(e) => setProfileForm({...profileForm, name: e.target.value})}
                                    className="w-full px-3 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:ring-2 focus:ring-orange-500 outline-none dark:text-white"
                                  />
                                </div>
                                <div className="space-y-1">
                                  <label className="text-[10px] font-bold text-slate-400 uppercase">Role / Title</label>
                                  <input 
                                    type="text" 
                                    value={profileForm.role} 
                                    onChange={(e) => setProfileForm({...profileForm, role: e.target.value})}
                                    className="w-full px-3 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:ring-2 focus:ring-orange-500 outline-none dark:text-white"
                                  />
                                </div>
                                <div className="flex space-x-2 pt-1">
                                  <button onClick={handleProfileSave} className="flex items-center space-x-1 px-3 py-1 bg-emerald-500 text-white rounded-md text-xs font-bold hover:bg-emerald-600">
                                    <Check size={14}/> <span>Save</span>
                                  </button>
                                  <button onClick={handleProfileCancel} className="flex items-center space-x-1 px-3 py-1 bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-md text-xs font-bold hover:bg-slate-300 dark:hover:bg-slate-600">
                                    <X size={14}/> <span>Cancel</span>
                                  </button>
                                </div>
                              </div>
                            ) : (
                              <div className="space-y-1 text-center sm:text-left">
                                <h4 className="text-base sm:text-lg font-bold dark:text-white">{adminProfile.name}</h4>
                                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">{adminProfile.role}</p>
                                <button 
                                  onClick={() => setIsEditingProfile(true)}
                                  className="text-[10px] sm:text-xs font-bold text-orange-600 hover:underline flex items-center justify-center sm:justify-start mt-2"
                                >
                                  <Edit2 size={12} className="mr-1" /> Edit Name/Role
                                </button>
                              </div>
                            )}
                        </div>
                        <div className="flex items-center justify-between p-3 sm:p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700">
                            <div className="flex items-center space-x-3">
                                <div className={`p-2 rounded-lg ${darkMode ? 'bg-indigo-900/30 text-indigo-400' : 'bg-indigo-100 text-indigo-600'}`}>
                                    {darkMode ? <Moon size={18} /> : <Sun size={18} />}
                                </div>
                                <div>
                                    <p className="text-xs sm:text-sm font-bold dark:text-slate-200">Dark Mode</p>
                                    <p className="text-[10px] sm:text-xs text-slate-500">Enable dark theme for the dashboard</p>
                                </div>
                            </div>
                            <button 
                                onClick={() => setDarkMode(!darkMode)}
                                className={`w-10 sm:w-12 h-5 sm:h-6 rounded-full relative transition-colors duration-200 ${darkMode ? 'bg-orange-500' : 'bg-slate-300'}`}
                            >
                                <div className={`absolute top-0.5 sm:top-1 w-4 h-4 bg-white rounded-full transition-transform duration-200 ${darkMode ? 'translate-x-5 sm:translate-x-7' : 'translate-x-0.5 sm:translate-x-1'}`}></div>
                            </button>
                        </div>
                     </Card>
                  </div>

                  <div className="md:col-span-1 pt-4 md:pt-0">
                     <h3 className="font-bold text-slate-800 dark:text-slate-200">Restaurant Info</h3>
                     <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">Update your store details and presence.</p>
                  </div>
                  <div className="md:col-span-2 space-y-4">
                     <Card>
                        <div className="space-y-4">
                           <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <label className="text-[10px] font-bold text-slate-500 uppercase">Restaurant Name</label>
                                <input 
                                  type="text" 
                                  value={restaurantInfo.name} 
                                  onChange={(e) => setRestaurantInfo({...restaurantInfo, name: e.target.value})}
                                  className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:ring-2 focus:ring-orange-500 outline-none dark:text-white" 
                                />
                              </div>
                              <div className="space-y-2">
                                <label className="text-[10px] font-bold text-slate-500 uppercase">Contact Email</label>
                                <input 
                                  type="email" 
                                  value={restaurantInfo.email} 
                                  onChange={(e) => setRestaurantInfo({...restaurantInfo, email: e.target.value})}
                                  className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:ring-2 focus:ring-orange-500 outline-none dark:text-white" 
                                />
                              </div>
                           </div>
                           <div className="space-y-2">
                              <label className="text-[10px] font-bold text-slate-500 uppercase">Business Address</label>
                              <textarea 
                                rows="2" 
                                value={restaurantInfo.address}
                                onChange={(e) => setRestaurantInfo({...restaurantInfo, address: e.target.value})}
                                className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:ring-2 focus:ring-orange-500 outline-none dark:text-white"
                              />
                           </div>
                        </div>
                     </Card>
                  </div>
               </div>

               <div className="flex justify-end space-x-4 pt-6 border-t border-slate-100 dark:border-slate-800">
                  <button 
                    onClick={() => setRestaurantInfo({
                      name: "FoodieDash Central",
                      email: "admin@foodiedash.com",
                      address: "123 Culinary Ave, Food District, NY 10001"
                    })}
                    className="flex items-center space-x-1 px-4 sm:px-6 py-2 text-slate-600 dark:text-slate-400 font-bold hover:text-slate-900 dark:hover:text-white text-sm"
                  >
                    <RotateCcw size={14} className="mr-1"/> Reset
                  </button>
                  <button 
                    onClick={handleRestaurantInfoSave}
                    className="px-4 sm:px-6 py-2 bg-orange-500 text-white rounded-lg font-bold shadow-lg shadow-orange-100 dark:shadow-none text-sm hover:bg-orange-600 transition-colors"
                  >
                    Save Changes
                  </button>
               </div>
            </div>
          )}

          {activeTab === 'customers' && (
             <div className="space-y-6 animate-in slide-in-from-left-4 duration-500">
                <div className="flex justify-between items-center">
                  <h1 className="text-xl sm:text-2xl font-bold dark:text-white">Customer Directory</h1>
                  <button onClick={() => downloadPDF(customers)} className="flex items-center space-x-2 text-orange-600 font-bold border border-orange-200 dark:border-orange-900/30 px-3 sm:px-4 py-2 rounded-lg hover:bg-orange-50 dark:hover:bg-orange-900/10 transition-all text-xs sm:text-sm">
                    <Download size={18}/> <span>Export CSV</span>
                  </button>
                </div>
                <Card className="p-0 sm:p-0">
                   <div className="overflow-x-auto -mx-4 sm:mx-0">
                     <table className="w-full text-left min-w-[600px] sm:min-w-0">
                       <thead>
                         <tr className="border-b border-slate-100 dark:border-slate-800 text-[10px] sm:text-xs uppercase text-slate-400 font-bold">
                           <th className="py-4 px-4 sm:px-6">Customer Name</th>
                           <th className="py-4 px-2">Join Date</th>
                           <th className="py-4 px-2">Orders</th>
                           <th className="py-4 px-2">Total Spent</th>
                           <th className="py-4 px-4 sm:px-6 text-right">Actions</th>
                         </tr>
                       </thead>
                       <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
                         {customers?.map(c => (
                           <tr key={c._id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                             
                             <td className="py-4 px-4 sm:px-6">
                               <div className="flex items-center space-x-3">
                                  <div className="w-8 h-8 rounded-full bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 flex items-center justify-center text-xs font-bold">{c.name.charAt(0)}</div>
                                  <div>
                                     <p className="text-xs sm:text-sm font-bold dark:text-slate-200">{c.name}</p>
                                     <p className="text-[10px] text-slate-400">{c.email}</p>
                                  </div>
                               </div>
                             </td>

                             <td className="py-4 px-2 text-xs sm:text-sm text-slate-500 dark:text-slate-400">{formatDateTime(c.joinDate)}</td>

                             <td className="py-4 px-2 text-xs sm:text-sm font-medium dark:text-slate-200">{c.totalOrders}</td>

                             <td className="py-4 px-2 font-bold text-xs sm:text-sm text-emerald-600 dark:text-emerald-400">{formatRupee(c.totalSpent)}</td>

                             <td className="py-4 px-4 sm:px-6 text-right">
                               {/* <button className="text-slate-400 hover:text-orange-500 p-2"><MoreVertical size={18}/></button> */}
                               <button onClick={() => openDeleteModalUser(c?._id)} className="text-slate-400 hover:text-orange-500 p-2 cursor-pointer"><Trash2 size={18}/></button>
                             </td>
                           </tr>
                         ))}
                       </tbody>
                     </table>
                   </div>
                </Card>
             </div>
          )}

          {/* All Reviews for Admin */}
          {activeTab === 'reviews' && (
            <AdminReviews/>
          )}
        </div>
      </main>


      {isMenuModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">

          <div className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-t-2xl sm:rounded-2xl shadow-2xl overflow-hidden animate-in slide-in-from-bottom sm:zoom-in-95 duration-200 max-h-[95vh] flex flex-col pb-0">
             
             <div className="sticky top-0 z-10 px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-white dark:bg-slate-900">
                <h3 className="font-bold text-slate-800 dark:text-white text-base sm:text-lg">{editingItem ? 'Edit Menu Item' : 'Add New Menu Item'}</h3>
                <button onClick={() => setIsMenuModalOpen(false)} className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-full transition-all"><X size={20}/></button>
             </div>

             <form onSubmit={handleMenuSubmit} className="px-6 pt-6 space-y-5 overflow-y-auto">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase">Dish Name</label>
                    <input 
                      name="name" 
                      required 
                      defaultValue={editingItem?.name} 
                      className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:ring-2 focus:ring-amber-500 outline-none dark:text-white" 
                      placeholder="e.g. Spicy Ramen" 
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase">Category</label>
                    <select name="category" defaultValue={editingItem?.category || 'Pizza'} className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:ring-2 focus:ring-amber-500 outline-none dark:text-white">
                       <option>Pizza</option>
                       <option>Burger</option>
                       <option>Sandwich</option>
                       <option>Chowmein</option>
                       <option>Pasta</option>
                       <option>Noodles</option>
                    </select>
                  </div>

                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase">Price (₹)</label>
                    <input 
                      name="price" 
                      type="number" 
                      required 
                      defaultValue={editingItem?.price} 
                      className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:ring-2 focus:ring-amber-500 outline-none dark:text-white" 
                      placeholder="0" 
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase">Initial Status</label>
                    <select name="status" defaultValue={editingItem?.status || 'Available'} className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:ring-2 focus:ring-amber-500 outline-none dark:text-white">
                       <option>Available</option>
                       <option>Out of Stock</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase">
                      Calories
                    </label>
                    <input
                      name="calories"
                      defaultValue={editingItem?.calories || ""}
                      className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:ring-2 focus:ring-amber-500 outline-none dark:text-white"
                      placeholder="e.g. 840 kcal"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase">
                      Ingredients
                    </label>
                    <textarea
                      name="ingredients"
                      rows="2"
                      defaultValue={editingItem?.ingredients?.join(", ")}
                      className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:ring-2 focus:ring-amber-500 outline-none dark:text-white"
                      placeholder="Black Truffle, Aged Gruyère, Brioche"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-500 uppercase">
                      Nutrients
                    </label>

                    {nutrients.map((nutrient, index) => (
                      <div key={index} className="grid grid-cols-2 gap-2">
                        <input
                          placeholder="e.g. Protein"
                          value={nutrient.label}
                          onChange={(e) => {
                            const updated = [...nutrients];
                            updated[index].label = e.target.value;
                            setNutrients(updated);
                          }}
                          className="px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm dark:text-white"
                        />

                        <input
                          placeholder="e.g. 45g"
                          value={nutrient.value}
                          onChange={(e) => {
                            const updated = [...nutrients];
                            updated[index].value = e.target.value;
                            setNutrients(updated);
                          }}
                          className="px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm dark:text-white"
                        />
                      </div>
                    ))}

                    <button
                      type="button"
                      onClick={() =>
                        setNutrients([...nutrients, { label: "", value: "" }])
                      }
                      className="text-xs font-bold text-amber-600 hover:underline"
                    >
                      + Add Nutrient
                    </button>
                  </div>

                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase">Description</label>
                  <textarea name="description" rows="3" defaultValue={editingItem?.description} className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:ring-2 focus:ring-amber-500 outline-none dark:text-white" placeholder="Describe the ingredients..."></textarea>
                </div>

                {/* Multiple Images Selection */}
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-500 uppercase">Product Images</label>
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">

                    { editingItem &&
                      existingImages?.map((img, idx) => (
                        <div key={idx} className="relative aspect-square rounded-lg overflow-hidden border border-slate-200 dark:border-slate-700 group">

                          <img src={img.url} alt="Product" className="w-full h-full object-cover" />

                          <button type="button" onClick={() => removeExistingImage(idx)} className="absolute top-1 right-1 p-1 bg-rose-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                            <X size={12} />
                          </button>
                        </div>
                    ))}

                    { previewImages?.map((img, idx) => (
                      <div
                        key={idx}
                        className="relative aspect-square rounded-lg overflow-hidden border border-slate-200 dark:border-slate-700 group"
                      >
                        <img
                          src={img}
                          alt="Product"
                          className="w-full h-full object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => removeProductImage(idx)}
                          className="absolute top-1 right-1 p-1 bg-rose-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X size={12} />
                        </button>
                      </div>
                    ))}

                    <label className="aspect-square flex flex-col items-center justify-center border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-lg cursor-pointer hover:border-amber-500 hover:bg-amber-50/50 dark:hover:bg-amber-900/10 transition-all">
                      
                      <UploadCloud size={20} className="text-slate-400 mb-1" />
                      <span className="text-[10px] font-bold text-slate-400">ADD</span>

                      <input 
                        type="file" 
                        multiple 
                        accept="image/*" 
                        className="hidden" 
                        onChange={handleProductImageUpload} 
                      />
                    </label>
                  </div>
                </div>

                <div className="pt-2 pb-8 flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-3 sticky bottom-0 bg-white dark:bg-slate-900">
                  <button 
                    type="button" 
                    disabled={isSubmitting}
                    onClick={() => setIsMenuModalOpen(false)} 
                    className="order-2 sm:order-1 px-6 py-2.5 text-slate-500 font-bold hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg transition-all text-sm"
                  >
                    Cancel
                  </button>

                  <button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="order-1 sm:order-2 px-6 py-2.5 bg-amber-500 hover:bg-amber-600 text-white rounded-lg font-bold transition-all shadow-lg shadow-orange-100 dark:shadow-none text-sm"
                  >
                    {/* {editingItem ? 'Save Changes' : 'Create Item'} */}
                    {isSubmitting ? (
                      <div className='flex gap-2 items-center justify-center'>
                        <ButtonLoader />
                        <span>
                          {editingItem ? "Saving..." : "Creating..."}
                        </span>
                      </div>
                    ) : (
                      editingItem ? "Save Changes" : "Create Item"
                    )}
                  </button>
                </div>
             </form>
          </div>
        </div>
      )}


    {/* product delete component */}
    {isModalOpen && (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-80 shadow-xl transform transition-all">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">Delete Item?</h3>
          <p className="text-gray-500 dark:text-gray-400 mt-2">
            This action cannot be undone. Are you sure you want to remove this product?
          </p>
          
          <div className="flex gap-3 mt-6">
            <button 
              onClick={() => setIsModalOpen(false)}
              className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition cursor-pointer"
            >
              Cancel
            </button>
            <button 
              onClick={confirmDelete}
              className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition shadow-sm cursor-pointer"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    )}

    {/* delete Customer component */}
    {isDeleteModalOpen && (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-80 shadow-xl transform transition-all">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">Delete Customer?</h3>
          <p className="text-gray-500 dark:text-gray-400 mt-2">
            This action cannot be undone. Are you sure you want to delete this customer?
          </p>
          
          <div className="flex gap-3 mt-6">
            <button 
              onClick={() => setIsDeleteModalOpen(false)}
              className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition cursor-pointer"
            >
              Cancel
            </button>
            <button 
              onClick={confirmDeleteUser}
              className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition shadow-sm cursor-pointer"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    )}
    </div>
  );
}