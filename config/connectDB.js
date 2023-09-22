import mongoose from "mongoose";

const connectDB=async(DB_URL)=>{
    const DB_OPTIONS={
        dbName:"EHL"
    };
    try {
        await mongoose.connect(DB_URL,DB_OPTIONS);
        console.log('connected successfully...'); 
    } catch (error) {
        console.log(`error: ${error}`);
    }
    
}

export default connectDB;