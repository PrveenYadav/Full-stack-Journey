import express from 'express';
import { getUserData, isAuthenticated, login, logout, register, resetPassword, sendResetOtp, sendVerifyOtp, updateUserProfile, uploadProfileImage, verifyEmail } from '../controllers/userController.js';
import userAuth from '../middlewares/userAuth.js';
import upload from '../middlewares/multer.js';

const userRouter = express.Router();

userRouter.get('/data', userAuth, getUserData)

userRouter.post('/register', register);
userRouter.post('/login', login);
userRouter.post('/logout', userAuth, logout);

userRouter.post('/send-verify-otp', userAuth, sendVerifyOtp);
userRouter.post('/verify-account', userAuth, verifyEmail);

userRouter.get('/is-auth', userAuth, isAuthenticated);

userRouter.post('/send-reset-otp', sendResetOtp);
userRouter.post('/reset-password', resetPassword);

// upload profile image
userRouter.post("/upload-profile", userAuth, upload.single("image"), uploadProfileImage);
userRouter.put("/update-profile", userAuth, updateUserProfile);


export default userRouter