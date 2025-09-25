import mongoose from "mongoose";

const connectDB = async () => {
  try {
    console.log("🔗 Connecting to MongoDB...", process.env.MONGO_URI);
    await mongoose.connect(process.env.MONGO_URI as string);
    console.log("✅ MongoDB connected");
  } catch (err) {
    console.error("❌ MongoDB connection error:", err);
    process.exit(1);
  }
};

export default connectDB;
