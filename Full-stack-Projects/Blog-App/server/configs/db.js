import mongoose from "mongoose";

export const connectDB = async () => {
    try {
        mongoose.connection.on('connected', () => console.log('MongoDB Database connected'));
        await mongoose.connect(`${process.env.MONGODB_URI}/quickBlog`);
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
}