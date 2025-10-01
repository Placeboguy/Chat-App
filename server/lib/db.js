import mongoose from "mongoose";

export const connectDB = async () => {
  try{
    mongoose.connection.on("connected", () => console.log("MongoDB connected"));
    mongoose.connection.on("error", (error) => console.log("MongoDB connection error:", error));
    
    await mongoose.connect(`${process.env.MONGODB_URI}/chat-app`);
  }catch (error) {
    console.log("Failed to connect to MongoDB:", error);
    process.exit(1);
  }
}