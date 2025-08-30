import express from 'express';
import { connectDB } from './config/db.js';
import router from './routes/todoRoute.js';
import cors from 'cors'

// dotenv for loading env variables faster
import dotenv from 'dotenv'
dotenv.config()

const app = express(); //creating app from express
app.use(express.json()); //we need information only in the json format
app.use(cors());

// calling the dbconnect function
connectDB();

// basic message
app.get('/', (req, res) => {
    res.send("Your backend is ready");
})

// calling a router at this route
app.use('/todos', router);

// port and app listening
const port = 3000 || process.env.PORT
app.listen(port, () => {
    console.log(`app is running on port: ${port} and the url is: ${'http://localhost:3000'}`)
})