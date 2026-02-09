import express from 'express';
import { getUserData, googleAuth, isAuthenticated, login, logout, register, resetPassword, sendResetOtp, sendVerifyOtp, updateUserProfile, uploadProfileImage, verifyEmail } from '../controllers/userController.js';
import userAuth from '../middlewares/userAuth.js';
import upload from '../middlewares/multer.js';
import { addAddress, deleteAddress, editAddress, setDefaultAddress } from '../controllers/addressController.js';

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

// google OAuth
userRouter.post("/google-auth", googleAuth);

// addresses
userRouter.post("/address", userAuth, addAddress);
userRouter.put("/address/:id", userAuth, editAddress);
userRouter.delete("/address/:id", userAuth, deleteAddress);
userRouter.put("/address/default/:id", userAuth, setDefaultAddress);


export default userRouter