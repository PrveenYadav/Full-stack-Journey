import { AdminContextProvider } from "./AdminContext.jsx";
import { AppContextProvider } from "./AppContext.jsx";
import { CartProvider } from "./CartContext.js";

// here will be all context folders
export const AppProviders = ({ children }) => {
  return (
    <AppContextProvider>
      <AdminContextProvider>
        <CartProvider>
          {children}
        </CartProvider>
      </AdminContextProvider>
    </AppContextProvider>
  );
};