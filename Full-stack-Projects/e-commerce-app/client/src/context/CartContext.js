import React, { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';
import { AppContext } from "./AppContext.jsx";
import axios from "axios";

export const CartContext = createContext();

export function CartProvider({ children }) {

  const [categoryFilter, setCategoryFilter] = useState('All');
  const [subFilter, setSubFilter] = useState('All');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  // const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [paymentMethod, setPaymentMethod] = useState('card');;
  const navigate = useNavigate();
  const { backendUrl, userData } = useContext(AppContext);

  const formatPrice = (p) => `₹${p?.toLocaleString('en-IN')}`;

  const [subTab, setSubTab] = useState(
    () => localStorage.getItem("accountSubTab") || "profile"
  );
  useEffect(() => {
    localStorage.setItem("accountSubTab", subTab);
  }, [subTab]);

  // saving cartItems into local storage
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem("cart");
    return savedCart ? JSON.parse(savedCart) : [];
  });

  // Whenever cartItems change, update localStorage
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  // saving wishlist items in local storage
  useEffect(() => {
    const savedWishlist = localStorage.getItem('user_wishlist');
    if (savedWishlist) {
      setWishlist(JSON.parse(savedWishlist));
    }
  }, []);
  
  const toggleWishlist = (product) => {
    let updatedWishlist;
    const exists = wishlist.find((item) => item._id === product._id);

    if (exists) {
      // Remove product
      updatedWishlist = wishlist.filter((item) => item._id !== product._id);
    } else {
      // Add product (only store necessary info to save space)
      const productData = {
        _id: product._id,
        name: product.name,
        image: product.images[0].url,
        price: product.price
      };
      updatedWishlist = [...wishlist, productData];
    }

    setWishlist(updatedWishlist);
    localStorage.setItem('user_wishlist', JSON.stringify(updatedWishlist));
    return !exists; // Returns true if added, false if removed
  };

  const addToCart = (product, selectedSize, selectedColor) => {
    const variant = product.variants.find(
      (v) => v.color === selectedColor && v.size === selectedSize,
    );

    if (!variant) {
      alert("Please select color and size");
      return;
    }

    setCart((prevCart) => {
      const existingItemIndex = prevCart.findIndex(
        (item) =>
          item.productId === product._id &&
          item.color === variant.color &&
          item.size === variant.size,
      );

      if (existingItemIndex > -1) {
        // Increase quantity
        const updatedCart = [...prevCart];
        updatedCart[existingItemIndex].quantity += 1;
        return updatedCart;
      }

      // Add new item
      return [
        ...prevCart,
        {
          productId: product._id,
          name: product.name,
          price: product.price,
          image: product.images[variant.imageIndex].url,
          color: variant.color,
          size: variant.size,
          quantity: 1,
          stock: variant.stock,
        },
      ];
    });
  };

  const removeFromCart = (index) => {
    const newCart = [...cart];
    newCart.splice(index, 1);
    setCart(newCart);
  };

  const formattedItems = cart.map(item => ({
    productId: item.productId,
    name: item.name,
    price: Number(item.price),
    quantity: item.quantity,
    color: item.color, 
    size: item.size,
    image: item.image
  }));
  
  const handleCheckout = () => {
    if (!userData?.addresses?.[0]) {
      toast.error("Please set address")
    }

    // const defaultAddr = userData?.addresses?.find(a => a.isDefault) || userData?.addresses[0];
    const defaultAddr = userData?.addresses?.find(a => a.isDefault);

    const orderInfo = { 
      name: defaultAddr.fullName, 
      email: defaultAddr.email, 
      phone: defaultAddr.phone, 
      pincode: defaultAddr.zip, 
      street: defaultAddr.street, 
      city: defaultAddr.city, 
      country: defaultAddr.country, 
      // address, 
    };

    const orderPayload = {
      orderInfo: orderInfo,
      items: formattedItems,
      paymentInfo: {
        method: paymentMethod // "cod"
      },
      totals: {
        // grandTotal: total
        grandTotal: cart.reduce((a, c) => a + (c.price * c.quantity), 0)
      }
    };
    
    if (createOrder(orderPayload)) {
      toast.success("Order Placed Successfully!");
      navigate('/account')
      setCart([]);
    }
  }

  const createOrder = async (orderPayload) => {
    axios.defaults.withCredentials = true;

    try {
      const { data } = await axios.post(backendUrl + '/api/order/create', orderPayload)

      if (data.success) {
        toast.success(data.success)
      } else {
        toast.error(data.messsage)
      }

    } catch (error) {
      console.log(error.messsage || "Error in creating order")
    }
  }
  

  const contextValue = { 
    subTab,
    setSubTab,
    addToCart,
    toggleWishlist,
    removeFromCart,
    handleCheckout,
    searchQuery,
    setSearchQuery,
    categoryFilter,
    setCategoryFilter, 
    subFilter,
    setSubFilter,
    selectedProduct,
    setSelectedProduct,
    isSearchOpen,
    setIsSearchOpen,
    cart,
    setCart,
    wishlist,
    setWishlist,
    paymentMethod,
    setPaymentMethod,
    formatPrice,
  }

  return React.createElement( CartContext.Provider,
    { value: contextValue },
    children
  );
}
