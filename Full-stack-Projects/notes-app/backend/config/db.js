import mongoose from "mongoose";

export const connectDB = async () => {
    const DB_NAME = "notes-app"
    try {
        const conn = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);
        console.log(`MongoDB connected successfully !! DB HOST: ${conn.connection.host}`);
    } catch (error) {
        console.log("Failed to connect database", error);
        process.exit(1);
    }
}