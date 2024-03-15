import mongoose from "mongoose";

const connectDB = async (DB_URL) => {
  mongoose.set("strictQuery", false);
  try {
    await mongoose.connect(DB_URL);
    console.log("connected successfully on mongoDB Atlas ....");
  } catch (error) {
    console.log(`error: ${error}`);
  }
};

export default connectDB;
