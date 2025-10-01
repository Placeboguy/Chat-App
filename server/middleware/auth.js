import User from "../models/User.js";
import jwt from "jsonwebtoken";

export const protectRoute =  async(req, res, next) => {
    try{
        const token = req.headers.token;
        console.log("Token received:", token ? "present" : "missing");

        if (!token) {
            return res.json({ success: false, message: "No token provided" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log("Decoded token userID:", decoded.userID);
        
        const user = await User.findById(decoded.userID).select("-password");
        if(!user){
            return res.json({ success: false, message: "User not found" });
        }
        console.log("User found:", user.fullName);
        req.user = user;
        next();
    }catch (error) {
        console.log("Auth middleware error:", error.message);
        res.json({ success: false, message: error.message });
    }
}

//controller to check if user is authenticated
export const checkAuth = async (req, res) => {
    res.json({ success: true, user: req.user });
}