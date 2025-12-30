import { ChevronRight, Code2, Home, Phone, ShoppingCart, User } from 'lucide-react';
import React from 'react'
import { useNavigate } from 'react-router-dom';

export const HamburgerButton = ({ isOpen, setIsOpen }) => {

    const navLinks = [
        { name: 'Home', path: '/', icon: <Home size={18} /> },
        { name: 'About', path: '/about', icon: <User size={18} /> },
        { name: 'Contact', path: '/contact-us', icon: <Phone size={18} /> },
        { name: 'Your Cart', path: '/cart', icon: <ShoppingCart size={18} /> },
    ];

    const navigate = useNavigate()
    
    if (!isOpen) return null;

  return (
    <div className="fixed inset-0 top-18 z-40 dark:bg-gray-900 bg-white md:hidden animate-in fade-in slide-in-from-top-5 duration-200 h-fit">
      <div className="p-4 space-y-2">
        {navLinks.map((link) => (
          <button
            key={link.name}
            onClick={() => {
                navigate(link.path)
                setIsOpen(false)
            }}
            className="flex items-center justify-between px-4 py-4 rounded-lg text-base font-medium text-black dark:text-slate-300 hover:bg-slate-800 hover:text-indigo-400 border border-transparent hover:border-slate-700 active:scale-90 transition-all ease-in-out"
          >
            <span className="flex items-center gap-4">
              {link.icon}
              {link.name}
            </span>
            <ChevronRight size={16} className="text-slate-600" />
          </button>
        ))}
      </div>
    </div>
  );
};