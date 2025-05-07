import app from './app.js';
import connectDB from './db/index.js';

// require('dotenv').config({path: './env'})
import dotenv from 'dotenv'
dotenv.config()

connectDB()
.then(() => {
    app.listen(process.env.PORT || 8000, () => {
        console.log(`App is running on port: ${process.env.PORT}`);
    })
})
.catch((error) => {
    console.log("MongoDb Connection Failed !", error);
})

/*
import express from 'express'
const app = express();

// IIFE (Immediately Invoked Function Expression)
( async () => {
    try {
        await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)

        app.on("error", (error) => {
            console.log("App is unable to talk with databse", error);
            throw error;
        })

        app.listen(process.env.PORT, () => {
            console.log(`App is listening on port ${process.env.PORT}`)
        })
    } catch (error) {
        console.log("ERROR: ", error);
        throw error
    }
})()

*/