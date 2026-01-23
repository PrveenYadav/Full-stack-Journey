import mongoose from "mongoose";

const connectDB = async () => {
    // const DB_NAME = "food-app";
    try {
        // await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);
        await mongoose.connect(`${process.env.MONGODB_URI}/food-app`);
        // console.log("Connected DB:", mongoose.connection.name);
        console.log("DATABASE connected Successfully !!!");
    } catch (error) {
        console.log("Failed to connect database", error.message);
        process.exit(1);
    }
}

export default connectDB