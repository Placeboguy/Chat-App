import { createContext } from "react";
import axios from "axios";
import { useState } from "react";
import toast from "react-hot-toast";
import { useEffect } from "react";
import { io } from "socket.io-client";

const backendURL=import.meta.env.VITE_BACKEND_URL
axios.defaults.baseURL=backendURL

export const AuthContext=createContext()

export const AuthProvider=({children})=>{

    const [token,setToken]=useState(localStorage.getItem("token"));
    const [authUser,setAuthUser]=useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [onlineUser,setOnlineUser]=useState([]);
    const [socket,setSocket]=useState(null);


    const checkAuth=async()=>{
        try {
           console.log("AuthContext: Checking auth with token:", token ? token.substring(0, 20) + "..." : "No token");
           const {data} = await axios.get("/api/auth/check");
           console.log("AuthContext: CheckAuth response:", data);
           if(data.success){
            console.log("AuthContext: Auth check successful, setting user:", data.user.fullName);
            setAuthUser(data.user);
            connectSocket(data.user);
           }
        } catch (error) {
            console.error("AuthContext: CheckAuth error:", error);
            toast.error("Session check failed. Please log in again.");
            setAuthUser(null); // Ensure user is logged out on error
            // Clear invalid token
            localStorage.removeItem("token");
            setToken(null);
            axios.defaults.headers.common["token"]=null;
        } finally {
            setIsLoading(false);
        }
    }

    //Logic to connect socket
    const login = async (state, credentials)=>{
        try {
            console.log("AuthContext: Making login request:", state, credentials);
            const endpoint = state === 'signup' ? '/api/auth/signup' : '/api/auth/login';
            const {data} = await axios.post(endpoint, credentials);
            console.log("AuthContext: Server response:", data);
            if(data.success){
                console.log("AuthContext: Setting user data:", data.userData);
                setAuthUser(data.userData);
                connectSocket(data.userData);
                axios.defaults.headers.common["token"]=data.token;
                setToken(data.token);
                localStorage.setItem("token", data.token);
                console.log("AuthContext: Token stored, user set:", data.userData.fullName);
                toast.success(data.message);
            }else{
                console.log("AuthContext: Login failed:", data.message);
                toast.error(data.message);
            }
        } catch (error) {
            console.log("AuthContext: Login error:", error);
            toast.error(error.message);
        }
    }

    //logout
    const logout= async()=>{
        console.log("AuthContext: Logging out user:", authUser?.fullName);
        localStorage.removeItem("token");
        setToken(null);
        setAuthUser(null);
        setOnlineUser([]);
        axios.defaults.headers.common["token"]=null;
        
        if(socket) {
            socket.disconnect();
            setSocket(null);
        }
        
        toast.success("Logged out successfully");
        
        // Force page reload to ensure clean state
        setTimeout(() => {
            window.location.href = '/login';
        }, 100);
    }

    //Uodate profile
    const updateProfile=async(body)=>{
        try {
            const {data} = await axios.put("/api/auth/update-profile", body);
            if(data.success){
                setAuthUser(data.user);
                toast.success("Profile updated successfully");
            }
        } catch (error) {
            toast.error(error.message);
        }
    }

    const connectSocket=(userData)=>{
        if(!userData || socket?.connected) return;
        const newSocket=io(backendURL, { query: { userId: userData._id } });
        newSocket.connect();
        setSocket(newSocket);

        newSocket.on("getOnlineUsers", (usersIds) => {
            setOnlineUser(usersIds);
        });
    }

    useEffect(() => {
        if(token){
            axios.defaults.headers.common["token"]=token;
            checkAuth();
        } else {
            setIsLoading(false);
        }
    }, [token]);

    const value={
        authUser,
        login,
        logout,
        updateProfile,
        onlineUser,
        socket,
        token,
        isLoading
    }

    return(
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
}