import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import connectDB from './config/db.js';
import productRouter from './routes/productRoutes.js';
import adminRouter from './routes/adminRoutes.js';
import userRouter from './routes/userRoutes.js';
import orderRouter from './routes/orderRoutes.js';

// import 'dotenv/config'
import dotenv from 'dotenv';
dotenv.config();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser())
// app.use(cors());
app.use(cors({origin: "https://foodiegoin.onrender.com", credentials: true}))
// app.use(cors({origin: process.env.CLIENT_URL, credentials: true}))

// Database function call
connectDB(); 

app.get('/', (req, res) => res.send("Backend is working"));

// Routes
app.use('/api/admin', adminRouter);
app.use('/api/user', userRouter);
app.use('/api/product', productRouter);
app.use('/api/order', orderRouter);

const port = process.env.PORT || 3000

app.listen(port, () => console.log(`Your app is running on port ${port}`));
