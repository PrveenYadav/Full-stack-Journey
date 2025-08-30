// Database connection
import mongoose from "mongoose";

export const connectDB = async () => {
    const DB_NAME = "todo-app"
    try {
        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)

        console.log(`\n MongoDb connected !! DB HOST: ${connectionInstance.connection.host}`)

    } catch (error) {
        console.log("MONGODB Connection Error", error);
        process.exit(1); //Node.js provide this for error type
    }
}