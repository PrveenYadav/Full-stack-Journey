import axios from "axios";
import { useEffect, useState } from "react";
import { createContext } from "react";
import { toast } from "react-toastify";
import Loader from "../components/Loader.jsx";

export const AdminContext = createContext();

export const AdminContextProvider = ({children}) => {

    const backendUrl = import.meta.env.VITE_BACKEND_URL
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [adminAuthLoading, setAdminAuthLoading] = useState(true);

    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    axios.defaults.withCredentials = true;

    // const checkAdminAuth = async () => {
    //     setAdminAuthLoading(true)
    //     try {
    //         const { data } = await axios.get(backendUrl + '/api/admin/isAuthAdmin', { withCredentials: true });
    //         return data; // { success: true, admin: {...} }
    //     } catch (error) {
    //         return { success: false };
    //     } finally {
    //         setAdminAuthLoading(false)
    //     }
    // };

    // useEffect(() => {
    //     checkAdminAuth()
    //     .then(() => setIsAuthenticated(true))
    //     .catch(() => setIsAuthenticated(false));
    // }, []);


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


    // Admin orders -----------
    const fetchOrders = async () => {
        setLoading(true)
        try {
            const { data } = await axios.get(`${backendUrl}/api/admin/orders`, {
                withCredentials: true
            });
            
            setOrders(data.orders); 

        } catch (err) {
            console.log(err.message || "Error in fetching orders")
            // toast.error(err.response?.data?.message || err.message);
        } finally {
            setLoading(false)
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    const updateOrderStatus = async (orderId, newStatus) => {
        try {
            const { data } = await axios.put(`${backendUrl}/api/admin/order/${orderId}`, { 
                status: newStatus 
            });

            if (data.success) {
                await fetchOrders(); // Updating status/fetching again
            }
        } catch (error) {
            console.error("Update failed", error);
        }
    };


    // always in the last or after useEffects
    // if (adminAuthLoading) {
    //     return <Loader/>
    // }

    const contextValue = {
        backendUrl,
        checkAdminAuth, 
        isAuthenticated,
        setIsAuthenticated,
        orders,
        setOrders,
        loading,
        updateOrderStatus,
    }

    return (
        <AdminContext.Provider value={contextValue}>
            {children}
        </AdminContext.Provider>
    )

}
