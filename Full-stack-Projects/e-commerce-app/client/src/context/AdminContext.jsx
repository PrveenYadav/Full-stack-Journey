import axios from "axios";
import { useEffect, useState } from "react";
import { createContext } from "react";

export const AdminContext = createContext();

export const AdminContextProvider = ({children}) => {

    const backendUrl = import.meta.env.VITE_BACKEND_URL
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [adminAuthLoading, setAdminAuthLoading] = useState(true);

    axios.defaults.withCredentials = true;

    const checkAdminAuth = async () => {
        try {
            const { data } = await axios.get(backendUrl + '/api/admin/isAuthAdmin', { withCredentials: true });

            if (data.success) {
                setIsAuthenticated(true)
            }
            
        } catch (error) {
            console.log(error.message || "Error in Checking admin auth")
        } finally {
            setAdminAuthLoading(false)
        }
    };

    useEffect(() => {
        checkAdminAuth();
    }, []);

    const contextValue = {
        backendUrl,
        checkAdminAuth, 
        isAuthenticated,
        setIsAuthenticated,
        adminAuthLoading
    }

    return (
        <AdminContext.Provider value={contextValue}>
            {children}
        </AdminContext.Provider>
    )

}
