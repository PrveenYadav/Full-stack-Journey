import React, { createContext, useState } from "react";

export const CartContext = createContext();

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);

  // const addToCart = (item) => {
  //   setCartItems((prev) => [...prev, item]);
  // };
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
    { value: { cartItems, setCartItems, addToCart, handleRemoveItem } },
    children
  );
}
