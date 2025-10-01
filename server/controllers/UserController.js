import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import { generateToken } from '../lib/utils.js';
import cloudinary from '../lib/cloudinary.js';

//Signup new user
export const signup = async (req, res) => {
    console.log("Signup request received with body:", req.body);
    const { fullName, email, password, bio } = req.body;
  try {
    if (!fullName || !email || !password) {
        console.log("Missing required fields:", {fullName: !!fullName, email: !!email, password: !!password});
        return res.json({success: false, message: "Details missing"}); 
    }
    const user = await User.findOne({ email });
    if (user) {
        console.log("User already exists:", email);
        return res.json({success: false, message: "User already exists"}); 
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await User.create({
        fullName,
        email,
        password: hashedPassword,
        bio: bio || "" // Default to empty string if bio is not provided
    });

    console.log("New user created successfully:", newUser.email);
    const token = generateToken(newUser._id);
    res.json({ success: true, userData: newUser, token, message: "Account created successfully" });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
}

//controller for login
export const login = async (req, res) => {
    try{
        const {email, password} = req.body;
        console.log("Login attempt for email:", email);
        
        // Check if email and password are provided
        if (!email || !password) {
            console.log("Missing email or password");
            return res.json({ success: false, message: "Email and password are required" });
        }
        
        const userData = await User.findOne({ email });
        console.log("User found:", userData ? `ID: ${userData._id}, Email: ${userData.email}, Name: ${userData.fullName}` : "No user found");
        
        // Check if user exists
        if (!userData) {
            console.log("User not found for email:", email);
            return res.json({ success: false, message: "Invalid credentials" });
        }
        
        const isPasswordCorrect = await bcrypt.compare(password, userData.password);
        console.log("Password correct:", isPasswordCorrect);
        
        if(!isPasswordCorrect){
            console.log("Incorrect password for user:", userData.email);
            return res.json({ success: false, message: "Invalid credentials" });
        }
        
        const token = generateToken(userData._id);
        console.log("Login successful for user:", userData.fullName, "ID:", userData._id);
        res.json({ success: true, userData, token, message: "Login successful" });
    }catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
}

export const checkAuth = async (req, res) => {
    res.json({ success: true, user: req.user });
}

//controller to update user profile details
export const updateProfile = async (req, res) => {
    try{
        console.log("updateProfile called with body:", req.body);
        console.log("User ID from token:", req.user._id);
        
        const { fullName, bio, profilePic } = req.body;
        const userID = req.user._id;
        let updatedUser
        if(!profilePic){
           updatedUser = await User.findByIdAndUpdate(userID, { fullName, bio }, { new: true });
    }else{
        const upload = await cloudinary.uploader.upload(profilePic)
        updatedUser = await User.findByIdAndUpdate(userID, { fullName, bio, profilePic: upload.secure_url }, { new: true });
}
console.log("Updated user:", updatedUser);
res.json({ success: true, user: updatedUser, message: "Profile updated successfully" });
    } catch (error) {
        console.log("updateProfile error:", error.message);
        res.json({ success: false, message: error.message });
    }
}