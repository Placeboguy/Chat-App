import User from "../models/User.js";   
import Message from "../models/message.js";
import cloudinary from "../lib/cloudinary.js";
import { io, userSocketMap } from "../server.js";

export const getUserForSidebar = async (req, res) => {
    try {
        console.log("getUserForSidebar called for user:", req.user._id);
        const userID = req.user._id;
        const filteredUsers = await User.find({_id: {$ne: userID}}).select("-password");

        const unseenMessages = {}; // Use an object to store unseen message counts
        const promises = filteredUsers.map(async (user) => {
            const messages = await Message.find({ senderId: user._id, receiverId: userID, seen: false });
            if (messages.length > 0) {
                unseenMessages[user._id] = messages.length;
            }
        });
        await Promise.all(promises);
        console.log("Sending users:", filteredUsers.length, "unseenMessages:", unseenMessages);
        res.json({ success: true, users: filteredUsers, unseenMessages });
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
};

//get all messages for selected chat
export const getMessages = async (req, res) => {
    try {
        const {id: selectedUserId} = req.params;
        const myId = req.user._id;
        const messages = await Message.find({
            $or: [
                { senderId: myId, receiverId: selectedUserId },
                { senderId: selectedUserId, receiverId: myId }
            ]
        })
        await Message.updateMany({
            senderId: selectedUserId, receiverId: myId
        }, {seen: true});
        res.json({ success: true, messages });
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
        
    }
}

export const markMessagesAsSeen = async (req, res) => {
    try {
        const { id } = req.params;
        await Message.findByIdAndUpdate(id, { seen: true });
        res.json({ success: true});
        
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
}


export const sendMessage = async (req, res) => {
    try {
        const { text, image } = req.body;
        const receiverId = req.params.id;
        const senderId = req.user._id;

        let imageUrl;
        if (image) {
            const uploadResponse = await cloudinary.uploader.upload(image);
            imageUrl = uploadResponse.secure_url;
        }

        const newMessage = await Message.create({
            senderId,
            receiverId,
            text,
            image: imageUrl,
        })

        //emit the message to receiver if online
        const receiverSocketId = userSocketMap[receiverId];
        if (receiverSocketId) {
            io.to(receiverSocketId).emit("newMessage", newMessage);
        }

        res.json({ success: true, newMessage: newMessage });
        
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
}