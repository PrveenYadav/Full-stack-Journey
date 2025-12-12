import express from 'express'
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { connectDB } from './configs/db.js';
import authRouter from './routers/authRoutes.js';

import dotenv from 'dotenv';
import userRouter from './routers/userRoutes.js';
dotenv.config()

const app = express()
app.use(express.json())
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser())
app.use(cors({origin: ['http://localhost:5173'], credentials: true}))

// MONGO_DB Database connection
connectDB()

app.get('/', (req, res) => {
    res.send("Hello from the backend")
})

app.use('/api/auth', authRouter);
app.use('/api/user', userRouter);

const port = process.env.PORT || 3000

app.listen(port, () => console.log(`App is listening on http://localhost:${port}`))
