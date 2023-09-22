import mongoose from "mongoose";

const connectDB = async (DB_URL) => {
  const DB_OPTIONS = {
    useNewUrlParser: true,
  };
  mongoose.set("strictQuery", false);
  try {
    await mongoose.connect(DB_URL, DB_OPTIONS);
    console.log("connected successfully on mongoDB Atlas ....");
  } catch (error) {
    console.log(`error: ${error}`);
  }
};

export default connectDB;
