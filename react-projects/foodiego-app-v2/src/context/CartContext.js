import React, { createContext, useEffect, useState } from "react";

export const CartContext = createContext();

export function CartProvider({ children }) {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  // const [cartItems, setCartItems] = useState([]);

  // saving cartItems into local storage
  const [cartItems, setCartItems] = useState(() => {
    const savedCart = localStorage.getItem("cartItems");
    return savedCart ? JSON.parse(savedCart) : [];
  });

  // Whenever cartItems change, update localStorage
  useEffect(() => {
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
  }, [cartItems]);


  // adding items into cart with quantity
  const addToCart = (item) => {
    setCartItems(prevCart => {
      // Checking if item is already in the cart
      const itemExists = prevCart.find(cartItem => cartItem.id === item.id);
      if (itemExists) {
        // Increment quantity
        return prevCart.map(cartItem =>
          cartItem.id === item.id
            ? { ...cartItem, quantity: (cartItem.quantity || 1) + 1 }
            : cartItem
        );
      } else {
        // Add new item with quantity 1
        return [...prevCart, { ...item, quantity: 1 }];
      }
    });
  };

  const handleRemoveItem = (id) => {
    const updatedItems = cartItems.filter(item => item.id !== id);
    setCartItems(updatedItems);
  };

  return React.createElement(
    CartContext.Provider,
    { value: { cartItems, setCartItems, addToCart, handleRemoveItem, isCartOpen, setIsCartOpen, searchQuery, setSearchQuery } },
    children
  );
}
