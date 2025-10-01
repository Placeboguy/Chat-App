import mongoose from "mongoose";

export const connectDB = async () => {
  try{
    // Check if MONGODB_URI is defined
    if (!process.env.MONGODB_URI) {
      throw new Error("MONGODB_URI environment variable is not defined");
    }

    console.log("Attempting to connect to MongoDB...");
    console.log("MongoDB URI provided:", process.env.MONGODB_URI ? "✓ Yes" : "✗ No");
    
    mongoose.connection.on("connected", () => console.log("MongoDB connected successfully"));
    mongoose.connection.on("error", (error) => console.log("MongoDB connection error:", error));
    mongoose.connection.on("disconnected", () => console.log("MongoDB disconnected"));
    
    // Use the full URI directly without appending database name
    await mongoose.connect(process.env.MONGODB_URI);
    
    console.log("MongoDB connection established");
  }catch (error) {
    console.log("Failed to connect to MongoDB:", error);
    process.exit(1);
  }
}