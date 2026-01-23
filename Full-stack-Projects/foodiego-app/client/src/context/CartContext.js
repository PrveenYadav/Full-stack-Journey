import React, { createContext, useEffect, useState } from "react";

export const CartContext = createContext();

export function CartProvider({ children }) {
  const [searchQuery, setSearchQuery] = useState("");
  // const [cartItems, setCartItems] = useState([]);

  // saving cartItems into local storage
  const [cartItems, setCartItems] = useState(() => {
    const savedCart = localStorage.getItem("cartItems");
    return savedCart ? JSON.parse(savedCart) : [];
  });

  const [orderData, setOrderData] = useState()

  // console.log("Order data is: ", orderData)

  // Whenever cartItems change, update localStorage
  useEffect(() => {
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
  }, [cartItems]);

  
  const addToCart = (item, quantity) => {
    setCartItems(prevCart => {
      // Checking if item is already in the cart
      const itemExists = prevCart?.find(cartItem => cartItem?._id === item?._id);
      if (itemExists) {
        // Increment quantity
        return prevCart?.map(cartItem =>
          cartItem?._id === item?._id
            ? { ...cartItem, quantity: (cartItem?.quantity || 1) + quantity }
            : cartItem
        );
      } else {
        if (quantity > 1) {
          return [...prevCart, { ...item, quantity: quantity }];
        }
        // Add new item with quantity 1
        return [...prevCart, { ...item, quantity: 1 }];
      }
    });
  };

  // console.log("cart items  :: ", cartItems)

  const handleRemoveItem = (id) => {
    const updatedItems = cartItems.filter(item => item.id !== id);
    setCartItems(updatedItems);
  };

  return React.createElement(
    CartContext.Provider,
    { value: { cartItems, setCartItems, addToCart, handleRemoveItem, searchQuery, setSearchQuery, orderData, setOrderData } },
    children
  );
}
