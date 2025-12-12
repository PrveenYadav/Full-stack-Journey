import axios from "axios";
import { useEffect, useState } from "react";
import { createContext } from "react";
import { toast } from "react-toastify";

export const AppContext = createContext();

export const AppContextProvider = ({children}) => {

    const backendUrl = import.meta.env.VITE_BACKEND_URL
    const [isLoggedIn, setIsLoggedIn] = useState(false)
    const [userData, setUserData] = useState(false)

    axios.defaults.withCredentials = true;

    // function to check auth status
    const getAuthState = async () => {
        try {
            const { data } = await axios.get(backendUrl + '/api/auth/is-auth');
            
            if (data.success) {
                setIsLoggedIn(true);
                getUserData(); // Fetch full profile data
            }
        } catch (error) {
            const status = error?.response?.status;
            const errorMessage = error?.response?.data?.message;

            if (status === 401) { // Do NOT show a toast error.
                setIsLoggedIn(false);
            } else {
                toast.error(errorMessage || "Error in Auth status");
            }
        }
    }

    // The function to get user data
    const getUserData = async () => {
        try {
            const { data } = await axios.get(backendUrl + '/api/user/data');

            axios.defaults.withCredentials = true;

            if (data.success) {
                setUserData(data.userData);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error?.response?.data?.message || "Error in Getting user data");
        }
    }
    
    // console.log("userData is: ", userData)

    // Don't need to login agian on page refresh 
    useEffect(() => {
        getAuthState(); 
    }, [])


    const contextValue = {
        backendUrl,
        isLoggedIn,
        setIsLoggedIn,
        userData,
        setUserData,
        getUserData
    }

    return (
        <AppContext.Provider value={contextValue}>
            {children}
        </AppContext.Provider>
    )
}