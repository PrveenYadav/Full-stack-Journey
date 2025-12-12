import mongoose from "mongoose";

export const connectDB = async () => {
    const DB_NAME = "MERN Auth"
    try {
        await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
        console.log("MongoDB Connected Successfully !!!")
    } catch (error) {
        console.log("Failed to connect Database", error.message)
        process.exit(1)
    }
}