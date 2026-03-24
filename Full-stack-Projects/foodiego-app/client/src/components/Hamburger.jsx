import { ChevronRight, Code2, Home, Moon, Phone, ShoppingCart, Sun, User } from 'lucide-react';
import React from 'react'
import { useNavigate } from 'react-router-dom';

export const HamburgerButton = ({ isOpen, setIsOpen, darkMode, toggleDarkMode }) => {

    const navLinks = [
        // { name: 'Home', path: '/', icon: <Home size={18} /> },
        { name: 'About', path: '/about', icon: <User size={18} /> },
        { name: 'Contact', path: '/contact-us', icon: <Phone size={18} /> },
        { name: 'Your Cart', path: '/cart', icon: <ShoppingCart size={18} /> },
    ];

    const navigate = useNavigate()
    
    if (!isOpen) return null;

  return (
    <div className="fixed inset-0 top-18 z-40 dark:bg-zinc-900 bg-white md:hidden animate-in fade-in slide-in-from-top-5 h-fit">
      <div className="p-4 space-y-2">
        {navLinks.map((link) => (
          <button
            key={link.name}
            onClick={() => {
                navigate(link.path)
                setIsOpen(false)
            }}
            className="flex items-center justify-between px-4 py-4 rounded-lg text-base font-medium text-black dark:text-zinc-300 hover:bg-zinc-800 hover:text-indigo-400 border border-transparent hover:border-zinc-700 active:scale-90 transition-all ease-in-out"
          >
            <span className="flex items-center gap-4">
              {link.icon}
              {link.name}
            </span>
            <ChevronRight size={16} className="text-zinc-600" />
          </button>
        ))}

        {/* Theme Toggle */}
        <button
          onClick={toggleDarkMode}
          className="flex items-center justify-between px-4 py-4 rounded-lg text-base font-medium text-black dark:text-zinc-300 hover:bg-zinc-800 hover:text-indigo-400 transition-all"
        >
          <span className="flex items-center gap-4">
            {darkMode ? <Sun size={18} /> : <Moon size={18} />}
            Toggle Theme
          </span>
        </button>
      </div>
    </div>
  );
};