import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config()


// CONNECT THE MONGODB

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("DB connected");
    } catch (e) {
        console.error(e.message);
        throw e;
    }
}


export default connectDB;