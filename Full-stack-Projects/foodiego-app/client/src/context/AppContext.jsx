import axios from "axios";
import { useEffect, useState } from "react";
import { createContext } from "react";
import { toast } from "react-toastify";
import Loader from "../components/Loader.jsx";

export const AppContext = createContext();

export const AppContextProvider = ({children}) => {

    const backendUrl = import.meta.env.VITE_BACKEND_URL
    const [isLoggedIn, setIsLoggedIn] = useState(false)
    const [userData, setUserData] = useState(false)
    const [authLoading, setAuthLoading] = useState(true);
    const [ordersLength, setOrdersLength] = useState(0);

    const [productData, setProductData] = useState({})
    const [loading, setLoading] = useState(true)

    const COOKING_TIMES = {
        pizza: "15-20 min",
        burger: "20-25 min",
        pasta: "12-18 min",
        sandwich: "10-15 min",
        noodles: "10-12 min",
        default: "12-15 min"
    };

    const prepTime = (dish) => {
        const categoryKey = dish.category.toLowerCase();
        return COOKING_TIMES[categoryKey] || COOKING_TIMES.default;
    }

    axios.defaults.withCredentials = true;

    // function to check auth status
    const getAuthState = async () => {
        setAuthLoading(true)

        try {
            const { data } = await axios.get(backendUrl + '/api/user/is-auth');
            
            if (data.success) {
                setIsLoggedIn(true);
                await getUserData();
            }
        } catch (error) {
            const status = error?.response?.status;
            const errorMessage = error?.response?.data?.message;

            // // If 401 then don't show a toast error.
            if (status === 401) {
                setIsLoggedIn(false);
            } else {
                // toast.error(errorMessage || "Error in Auth status");
                console.log(errorMessage || "Error in Auth status");
            }
        } finally {
            setAuthLoading(false)
        }
    }

    // The function to get user data
    const getUserData = async () => {
        try {
            const { data } = await axios.get(backendUrl + '/api/user/data');

            if (data.success) {
                setUserData(data.userData);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error?.response?.data?.message || "Error in Getting user data");
        }
    }

    // Don't need to login agian on page refresh 
    useEffect(() => {
        getAuthState(); 
    }, [])

    // product data
    const getProductData = async () => {
        setLoading(true)

        try {
            const {data} = await axios.get(backendUrl + "/api/product/all")
    
            if (data.success) {
                setProductData(data)
            } else {
                console.log(data.message)
            }
        } catch (error) {
            console.log("Error in getting product data" || error.message)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        getProductData(); 
    }, [])

    const contextValue = {
        backendUrl,
        isLoggedIn,
        setIsLoggedIn,
        userData,
        setUserData,
        getUserData,
        productData,
        setProductData,
        loading,
        ordersLength,
        setOrdersLength,
        authLoading,
        prepTime
    }

    return (
        <AppContext.Provider value={contextValue}>
            {children}
        </AppContext.Provider>
    )

}
