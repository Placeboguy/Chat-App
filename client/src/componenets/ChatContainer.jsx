import React from 'react'
import assets, { messagesDummyData } from '../assets/assets.js'
import { formatMessageTime } from '../lib/utils.js';
import { AuthContext } from '../../context/AuthContext.jsx';
import { chatContext } from '../../context/chatContext.jsx';
import toast from 'react-hot-toast';
import axios from 'axios';

const ChatContainer = ({selectedUser, setSelectedUser}) => {

  const { messages, sendMessage, getMessages, setMessages } = React.useContext(chatContext);
  const { authUser, onlineUser, socket } = React.useContext(AuthContext);

    const scrollEnd = React.useRef();

    const[input, setInput]=React.useState("");

    const handleSendMessage= async(e)=>{
        e.preventDefault();
        if(input.trim() === "") return null;
        if(!selectedUser) {
            toast.error("Please select a user to send message to");
            return;
        }
        await sendMessage({text:input.trim()}, selectedUser);
        setInput("")

    }

    const handleSendImage= async(e)=>{
      const file=e.target.files[0];
      if(!file || !file.type.startsWith('image/')){
        toast.error("Please select a valid image file");
        return;
      }
      if(!selectedUser) {
        toast.error("Please select a user to send image to");
        return;
      }
      const reader=new FileReader();
      reader.onload = async()=>{
        await sendMessage({image:reader.result}, selectedUser);
        e.target.value =""
      }
      reader.readAsDataURL(file);
    }

    React.useEffect(() => {
      if(selectedUser && selectedUser._id) {
        console.log("ChatContainer: Loading messages for user:", selectedUser.fullName);
        getMessages(selectedUser._id);
      }
    },[selectedUser])

    // Handle real-time messages for the selected user
    React.useEffect(() => {
        if (!socket || !selectedUser) return;

        const handleNewMessage = (newMessage) => {
            if (newMessage.senderId === selectedUser._id) {
                // Message from the currently selected user - add to messages and mark as seen
                setMessages((prevMessages) => [...prevMessages, newMessage]);
                // Mark message as seen
                axios.put(`/api/messages/mark/${newMessage._id}`);
            }
        };

        socket.on("newMessage", handleNewMessage);

        return () => {
            socket.off("newMessage", handleNewMessage);
        };
    }, [socket, selectedUser]);

    React.useEffect(() => {
        if(scrollEnd.current && messages) {
            scrollEnd.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages]);

    // Safety check - don't render if essential data is missing
    if (!authUser) {
        return <div className='flex items-center justify-center h-full text-white'>Loading user data...</div>;
    }

  return (
    selectedUser ? (
      <div className='h-full overflow-scroll relative backdrop-blur-lg'>
        <div className='flex items-center gap-3 py-3 mx-4 border-b border-stone-500'>
          <img src={selectedUser.profilePic || assets.avatar_icon} alt="" className="w-8 rounded-full"/>
          <p className='flex-1 text-lg text-white flex items-center gap-2'>
            {selectedUser.fullName}
            {onlineUser && onlineUser.includes(selectedUser._id) && (
              <span className="w-2 h-2 rounded-full bg-green-500"></span>
            )}
            {(!onlineUser || !onlineUser.includes(selectedUser._id)) && (
              <span className="w-2 h-2 rounded-full bg-red-500"></span>
            )}
          </p>
          <img onClick={() => setSelectedUser(null)} src={assets.arrow_icon} alt='' className='md-hidden max-w-7' />
          <img src={assets.help_icon} alt='' className='max-md:hidden max-w-5' />
        </div>
        <div className='flex flex-col h-[calc(100%-120px)] overflow-y-scroll p-3 pb-6'>
            {messages && messages.map((msg, index)=>(
                <div key={index} className={`flex items-end gap-2 justify-end ${msg.senderId !== authUser?._id && 'flex-row-reverse' }`}>
                    {msg.image ? (
                        <img src={msg.image} alt='' className='max-w-[230px] border border-gray-700 rounded-lg overflow-hidden mb-8'/>
                    ) : (
                        <p className={`p-2 max-w-[200px] md:text-sm font-light rounded-lg mb-8 break-all bg-violet-500/30 text-white ${msg.senderId !==authUser?._id ? 'rounded-br-none' : 'rounded-bl-none'}`}>{msg.text}</p>
                    )}
                    <div className='text-center text-xs'>
                            <img src={msg.senderId === authUser?._id ? authUser?.profilePic || assets.avatar_icon : selectedUser?.profilePic || assets.avatar_icon} alt='' className='w-7 rounded-full'/>
                            <p className='text-gray-500'>{ formatMessageTime (msg.createdAt)}</p>
                    </div>

                </div>
            ))} 
            <div ref={scrollEnd}></div>
        </div>
        <div className='absolute bottom-0 left-0 right-0 flex items-center gap-3 p-3'>
            <div className='flex-1 flex items-center bg-gray-100/12 px-3 rounded-full'>
                <input onChange={(e) => setInput(e.target.value)} value={input} onKeyDown={(e) => e.key === 'Enter' ? handleSendMessage(e) : null} type="text" placeholder='Send a message'  className='flex-1 text-sm p-3 border-none rounded-lg outline-none text-white placeholder-gray-400'/>
                <input onChange={handleSendImage} type="file" id='image' accept='image/png, image/jpeg' hidden />
                <label htmlFor="image">
                    <img src={assets.gallery_icon} alt='' className='w-5 mr-2  h-10 cursor-pointer' />
                </label>
            </div>
            <img onClick={handleSendMessage} src={assets.send_button} alt='' className='w-7 cursor-pointer' />

        </div>

      </div>
    ) : (
      <div className='flex flex-col items-center justify-center gap-2 text-gray-500 bg-white/10 max-md:hidden'>
        <img src={assets.logo_icon} alt="" className='max-w-16'/>
        <p className='text-lg font-medium text-white'>Chat anytime</p>
      </div>
    )
  );
}

export default ChatContainer
