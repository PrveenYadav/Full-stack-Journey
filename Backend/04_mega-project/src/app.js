import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'

const app = express();    

//app.use : we use for middlewares

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
}))

// handle multiple types of data 
app.use(express.json({limit: "16kb",}))
app.use(express.urlencoded({extended: true, limit: "16kb"}))
app.use(express.static("public"))
app.use(cookieParser())

//Importing Routes
import router from './routes/user.routes.js';

//routes declaration
app.use("/api/v1/users", router)

export default app