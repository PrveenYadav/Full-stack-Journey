import React, { useState, useEffect, useContext } from 'react';
import { LayoutDashboard, Box, ShoppingCart, Users, BarChart3, Sun, Moon, Menu, LogOut, ChevronLeft, Image as ImageIcon, UserStarIcon, X, ArrowRight} from 'lucide-react';
import { DashboardView } from './DashboardView.jsx';
import { InventoryView } from './InventoryView.jsx';
import { OrdersView } from './OrdersView.jsx';
import { CustomersView } from './CustomersView.jsx';
import { AdminReviews } from '../../components/admin/AdminReviews.jsx';
import axios from 'axios';
import { toast } from 'react-toastify';
import { AdminContext } from '../../context/AdminContext.jsx';

export default function AdminHome() {
  const [activePage, setActivePage] = useState('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { setIsAuthenticated, backendUrl} = useContext(AdminContext);

  // saving this page modes in local storage
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem("admin-page-theme");
    return saved === "dark";
  });

  useEffect(() => {
    const saved = localStorage.getItem("admin-page-theme");
    if (saved === "dark") setDarkMode(true);
  }, []);

  const toggleDarkMode = () => {
    setDarkMode((prev) => !prev);
  };

  useEffect(() => {
    localStorage.setItem("admin-page-theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

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

  const navItems = [
    { id: 'dashboard', label: 'Overview', icon: LayoutDashboard },
    { id: 'inventory', label: 'Inventory', icon: Box },
    { id: 'orders', label: 'Orders', icon: ShoppingCart },
    { id: 'customers', label: 'Customers', icon: Users },
    { id: 'reviews', label: 'Reviews', icon: UserStarIcon },
  ];

  return (
    <div className={`min-h-screen flex flex-col lg:flex-row transition-colors duration-500 ${darkMode ? 'dark bg-black' : 'bg-zinc-50'}`}>
      
      {/* Sidebar - Desktop */}
      <aside className={`fixed lg:sticky top-0 left-0 h-screen bg-white dark:bg-zinc-950 border-r border-zinc-200 dark:border-zinc-800 transition-all duration-300 z-[100] ${isSidebarOpen ? 'w-64' : 'w-20'} hidden lg:flex flex-col py-8 px-4 shadow-2xl`}>
        <div className="flex items-center gap-4 px-2 mb-12">
          <div className="w-10 h-10 bg-black dark:bg-white rounded-2xl flex items-center justify-center shrink-0 shadow-lg">
            <BarChart3 size={24} className="text-white dark:text-black" />
          </div>
          {isSidebarOpen && <span onClick={() => setActivePage("dashboard")} className="text-xl font-black tracking-tighter dark:text-white transition-opacity duration-300">OUTFYTLY <span className="text-zinc-500">PRO</span></span>}
        </div>

        <nav className="flex-grow space-y-2">
          {navItems.map(item => (
            <button 
              key={item.id}
              onClick={() => setActivePage(item.id)}
              className={`w-full cursor-pointer flex items-center gap-4 px-4 py-4 rounded-2xl text-sm font-black transition-all group ${activePage === item.id ? 'bg-black text-white dark:bg-white dark:text-black shadow-xl scale-[1.02]' : 'text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-900 hover:text-black dark:hover:text-white'}`}
            >
              <item.icon size={20} className={activePage === item.id ? 'animate-pulse' : 'group-hover:scale-110 transition-transform'} />
              {isSidebarOpen && <span className="uppercase tracking-widest text-[11px]">{item.label}</span>}
            </button>
          ))}
        </nav>

        <div className="pt-8 border-t border-zinc-100 dark:border-zinc-900 space-y-2">
          <button onClick={toggleDarkMode} className="cursor-pointer w-full flex items-center gap-4 px-4 py-4 rounded-2xl text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-all">
            {darkMode ? <Sun size={20}/> : <Moon size={20}/>}
            {isSidebarOpen && <span className="text-[11px] font-black uppercase tracking-widest">{darkMode ? 'Light Mode' : 'Dark Mode'}</span>}
          </button>

          <button onClick={handleLogout} className="cursor-pointer w-full flex items-center gap-4 px-4 py-4 rounded-2xl text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/10 transition-all">
            <LogOut size={20}/>
            {isSidebarOpen && <span className="text-[11px] font-black uppercase tracking-widest">Sign Out</span>}
          </button>

          <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="cursor-pointer hidden lg:flex w-full items-center gap-4 px-4 py-4 rounded-2xl text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-900">
            {isSidebarOpen ? <ChevronLeft size={20}/> : <Menu size={20}/>}
            {isSidebarOpen && <span className="text-[11px] font-black uppercase tracking-widest">Collapse</span>}
          </button>
        </div>
      </aside>

      {/* Mobile Top Header */}
      <div className="lg:hidden bg-white dark:bg-zinc-950 border-b border-zinc-200 dark:border-zinc-800 p-4 flex justify-between items-center sticky top-0 z-[100]">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-black dark:bg-white rounded-xl flex items-center justify-center text-white dark:text-black"><BarChart3 size={18}/></div>
          <span onClick={() => setActivePage("dashboard")} className="font-black text-sm tracking-tighter dark:text-white uppercase">Outfytly <span className="text-zinc-500">Admin</span></span>
        </div>
        <div className="flex gap-2">
          <button onClick={toggleDarkMode} className="p-2 text-zinc-500">{darkMode ? <Sun size={20}/> : <Moon size={20}/>}</button>

          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} 
            className="p-2 text-zinc-500"
          >
           { isMobileMenuOpen ? <X size={20}/> : <Menu size={20}/>}
          </button>
        </div>
      </div>

      <main className="flex-grow p-4 sm:p-8 lg:p-12 overflow-y-auto max-w-[1600px] mx-auto w-full pb-24 lg:pb-12">
        {activePage === 'dashboard' && <DashboardView />}
        {activePage === 'inventory' && <InventoryView />}
        {activePage === 'orders' && <OrdersView />}
        {activePage === 'customers' && <CustomersView />}
        {activePage === 'reviews' && <AdminReviews />}
      </main>

      {/* Mobile Bottom Nav */}
      <div className="lg:hidden fixed bottom-0 left-0 w-full bg-white/80 dark:bg-black/80 backdrop-blur-xl border-t border-zinc-200 dark:border-zinc-800 flex justify-around items-center p-4 z-[100]">
        {navItems.map(item => (
          <button 
            key={item.id} 
            onClick={() => setActivePage(item.id)}
            className={`p-3 rounded-2xl transition-all ${activePage === item.id ? 'bg-black text-white dark:bg-white dark:text-black shadow-lg' : 'text-zinc-400'}`}
          >
            <item.icon size={20} />
          </button>
        ))}
      </div>


      {isMobileMenuOpen && (
        <div
          className="lg:hidden inset-0 h-fit fixed top-[10%] z-150 bg-white dark:bg-zinc-950 border-t  border-zinc-200 dark:border-zinc-800 p-6 space-y-6 animate-in slide-in-from-top animate-out slide-out-to-top duration-300"
        >
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full text-left text-lg font-black uppercase tracking-tighter text-rose-500"
          >
            Logout <ArrowRight size={20}/>
          </button>
        </div>
      )}
    </div>
  );
}