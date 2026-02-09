import express from 'express';
import adminAuth from '../middlewares/adminAuth.js';
import { deleteOrder, deleteReview, deleteUser, getAdminMe, getAllCustomers, getAllOrders, getAllProductReviews, getAllProducts, getAllUsers, login, logout, updateOrderStatus, uploadProfileImage } from '../controllers/adminController.js';
import upload from '../middlewares/multer.js';

const adminRouter = express.Router();

adminRouter.post('/login', login);
adminRouter.post('/logout', adminAuth, logout);
adminRouter.get('/isAuthAdmin', adminAuth, getAdminMe);

adminRouter.get('/all-users', adminAuth, getAllUsers);
adminRouter.delete('/all-users/:id', adminAuth, deleteUser);

adminRouter.get('/all-products', adminAuth, getAllProducts);

adminRouter.get('/orders', adminAuth, getAllOrders);
adminRouter.delete('/order/:id', adminAuth, deleteOrder);
adminRouter.put('/order/:id', adminAuth, updateOrderStatus);

adminRouter.post("/upload-profile", adminAuth, upload.single("image"), uploadProfileImage);

adminRouter.get("/customers", adminAuth, getAllCustomers);

// Reviews
adminRouter.get("/product/reviews", adminAuth, getAllProductReviews);
adminRouter.delete("/product/:productId/reviews/:reviewId", adminAuth, deleteReview);


export default adminRouter