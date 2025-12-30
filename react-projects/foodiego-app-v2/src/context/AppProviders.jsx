import { AppContextProvider } from "./AppContext.jsx";
import { CartProvider } from "./CartContext.js";

// here will be all context folders
export const AppProviders = ({ children }) => {
  return (
    <AppContextProvider>
      <CartProvider>
        {children}
      </CartProvider>
    </AppContextProvider>
  );
};