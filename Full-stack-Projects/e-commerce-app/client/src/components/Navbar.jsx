import React, { useContext, useRef } from 'react';
import { ShoppingBag, Menu, X, Search, User, Sun, Moon } from 'lucide-react';
import { CartContext } from '../context/CartContext.js';
import { useLocation, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useEffect } from 'react';
import { AppContext } from '../context/AppContext.jsx';

export const Navbar = ({ cartCount }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { userData } = useContext(AppContext)
  const navigate = useNavigate();
  const menuRef = useRef(null); // mobile munu work - close on click outside or on scrolling

  const { 
    searchQuery,
    setSearchQuery,
    categoryFilter,
    isSearchOpen,
    setIsSearchOpen,
    setCategoryFilter
  } = useContext(CartContext);

  const location = useLocation();
  const isShopPage = location.pathname === "/shop";

  const handleCategoryClick = (cat) => {
    navigate('/shop');
    setCategoryFilter(cat);
    setIsMobileMenuOpen(false);
  }

  const handleLogoClick = () => {
    navigate('/');
    // window.scrollTo(0, 0);
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth"
    });
  }

  // dark/light mode saving into local storage
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("theme") === "dark";
  });

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode((prev) => !prev);
    setIsMobileMenuOpen(false)
  };


  useEffect(() => {
    if (!isMobileMenuOpen) return;

    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMobileMenuOpen(false);
      }
    };

    const handleScroll = () => {
      setIsMobileMenuOpen(false);
    };

    document.addEventListener("mousedown", handleClickOutside);
    window.addEventListener("scroll", handleScroll);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("scroll", handleScroll);
    };
  }, [isMobileMenuOpen]);

  return (
    <nav className="fixed top-0 w-full z-[150] bg-white/70 dark:bg-zinc-950/70 backdrop-blur-2xl border-b border-zinc-200 dark:border-zinc-800 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <div className="flex items-center gap-6 lg:gap-12">
            <span
              onClick={handleLogoClick}
              className="text-xl sm:text-2xl font-black tracking-tighter text-zinc-900 dark:text-white cursor-pointer select-none"
            >
              OUTFYTLY
            </span>
            <div className="hidden lg:flex space-x-8">
              {["Men", "Women"].map((cat) => (
                <button
                  key={cat}
                  onClick={() => handleCategoryClick(cat)}
                  className={`cursor-pointer text-sm font-black uppercase tracking-widest transition-all ${categoryFilter === cat ? "text-black dark:text-white" : "text-zinc-400 hover:text-zinc-600"}`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center space-x-1 sm:space-x-4">
            {isShopPage && (
              <div
                className={`relative flex items-center transition-all duration-500 ${
                  isSearchOpen ? "w-48 sm:w-64" : "w-10"
                }`}
              >
                <Search
                  onClick={() => setIsSearchOpen(!isSearchOpen)}
                  size={20}
                  className="absolute left-3 text-zinc-400 cursor-pointer"
                />

                <input
                  type="text"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  autoFocus={isSearchOpen}   // 🔥 IMPORTANT
                  className={`pl-10 pr-4 py-2 bg-zinc-100 dark:bg-zinc-900 rounded-full text-[10px] font-bold outline-none transition-all dark:text-white w-full ${
                    isSearchOpen ? "opacity-100" : "opacity-0 pointer-events-none"
                  }`}
                />
              </div>
            )}

            <button
              onClick={toggleDarkMode}
              className="cursor-pointer p-2 text-zinc-400 hover:text-black dark:hover:text-white hidden sm:block"
            >
              {/* {darkMode ? '☀️' : '🌙'} */}
              {darkMode ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </button>

            <button
              onClick={() => navigate("/cart")}
              className="cursor-pointer p-2 text-zinc-400 hover:text-black dark:hover:text-white relative"
            >
              <ShoppingBag size={20} />
              {cartCount > 0 && (
                <span className="absolute top-1 right-1 bg-black dark:bg-white text-white dark:text-black text-[9px] w-4 h-4 flex items-center justify-center rounded-full font-bold">
                  {cartCount}
                </span>
              )}
            </button>

            <button
              onClick={() => navigate("/account")}
              className="flex items-center space-x-2 p-1 pr-3 rounded-full hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
            >
              <div className="w-8 h-8 rounded-full overflow-hidden flex items-center justify-center ">
                {userData?.avatar ? (
                  <img
                    src={userData.avatar}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User size={20} className='text-zinc-400'/>
                )}
              </div>
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300 hidden sm:inline">
                {userData?.name?.split(" ")[0]}
              </span>
            </button>

            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 text-zinc-400"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

          </div>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div
          ref={menuRef}
          className="lg:hidden bg-white dark:bg-zinc-950 border-t border-zinc-100 dark:border-zinc-900 p-6 space-y-6 animate-in slide-in-from-top animate-out slide-out-to-top duration-300"
        >
          {["Men", "Women"].map((cat) => (
            <button
              key={cat}
              onClick={() => handleCategoryClick(cat)}
              className="block w-full text-left text-2xl font-black uppercase tracking-tighter dark:text-white"
            >
              {cat}
            </button>
          ))}
          <div className="h-px bg-zinc-100 dark:bg-zinc-900"></div>
          <button
            onClick={toggleDarkMode}
            className="flex items-center gap-4 text-zinc-400 font-bold uppercase tracking-widest text-xs"
          >
            {/* {darkMode ? 'Light Mode ☀️' : 'Dark Mode 🌙'} */}
            {darkMode ? (
              <div className="flex gap-2 items-center">
                Light Mode
                <Sun className="h-4 w-4" />
              </div>
            ) : (
              <div className="flex gap-2 items-center">
                Light Mode
                <Moon className="h-4 w-4" />
              </div>
            )}
          </button>
        </div>
      )}
    </nav>
  );
};