import express from 'express';
import cors from 'cors'
import router from './routes/noteRoute.js';
import { connectDB } from './config/db.js';

import dotenv from 'dotenv'
dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

connectDB();

app.get('/', (req, res) => {
    res.send("Your backend is ready");
})

app.use('/notes', router);

const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
    console.log(`App is running on: ${PORT} - http://localhost:3000`);
})