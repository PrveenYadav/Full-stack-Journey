import express from 'express';
import userAuth from '../middlewares/userAuth.js';
import { deleteUser, getUserData, getUsers } from '../controllers/userController.js';

const userRouter = express.Router()

userRouter.get('/all-users', getUsers)
userRouter.post('/all-users', deleteUser);

userRouter.get('/data', userAuth, getUserData)

export default userRouter