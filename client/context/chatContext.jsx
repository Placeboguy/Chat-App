import { createContext, useState, useContext } from "react";
import { AuthContext } from "./AuthContext";
import toast from "react-hot-toast";
import { useEffect } from "react";
import axios from "axios";

// Set base URL for axios
const backendURL = import.meta.env.VITE_BACKEND_URL;
axios.defaults.baseURL = backendURL;


export const chatContext= createContext();

export const ChatProvider=({children})=>{

    const [messages,setMessages]=useState([]);
    const [users,setUsers]=useState([]);
    const [unseenMessages,setUnseenMessages]=useState({});

    const {socket, token}=useContext(AuthContext);

    // Set axios authorization header when token changes
    useEffect(() => {
        if (token) {
            axios.defaults.headers.common["token"] = token;
        }
    }, [token]);

    //fucntion to get all users for sidebar
    const getUser = async()=>{
        try {
            console.log("getUser called, token:", token);
             const {data} = await axios.get("/api/messages/users");
             console.log("getUser response:", data);
             if(data.success){
                setUsers(data.users);
                setUnseenMessages(data.unseenMessages);
             } else {
                console.log("getUser failed:", data.message);
                toast.error(data.message);
             }
        } catch (error) {
            console.log("getUser error:", error);
            toast.error(error.message);
        }
    }

    //fucntion to get all messages between logged in user and selected user
    const getMessages= async(userId)=>{
        try {
             const {data} = await axios.get(`/api/messages/${userId}`);
             if(data.success){
                 setMessages(data.messages);
             }
        } catch (error) {
            toast.error(error.message);
        }
    }

    //function to send message
    const sendMessage= async(messageData, selectedUser)=>{
        try {
            if (!selectedUser || !selectedUser._id) {
                toast.error("Please select a user to send message to");
                return;
            }
            console.log("Sending message to:", selectedUser.fullName, "Data:", messageData);
            const {data} = await axios.post(`/api/messages/send/${selectedUser._id}`, messageData);
            console.log("Send message response:", data);
            if(data.success){
                setMessages((preMessages)=> [...preMessages, data.newMessage]);
            } else{
                toast.error(data.message);
            }
        } catch (error) {
            console.log("Send message error:", error);
            toast.error(error.response?.data?.message || error.message);
        }
    }

    //function to subscribe to new messages
    const subscribeToNewMessages= async ()=>{
        if(!socket)return;

        socket.on("newMessage", (newMessage)=>{
            // Always add to unseen messages for any user except the current user
            setUnseenMessages((prevUnseenMessages)=>({
                ...prevUnseenMessages,[newMessage.senderId]:prevUnseenMessages[newMessage.senderId] ? prevUnseenMessages[newMessage.senderId] + 1 : 1
            }))
        })

    }

    //funtion to mark messages as seen
    const unsubscribeFromMessages=()=>{
        if(socket) socket.off("newMessage");
    }

    useEffect(()=>{
        subscribeToNewMessages();
        return ()=> unsubscribeFromMessages();

    },[socket])


    const value ={
        messages,
        users,
        getUser,
        getMessages,
        sendMessage,
        setMessages,
        unseenMessages,
        setUnseenMessages

    }
    return ( 
    <chatContext.Provider value={value}>
        {children}
    </chatContext.Provider>
    )
}