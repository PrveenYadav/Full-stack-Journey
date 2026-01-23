import express from 'express';
import { addProduct, deleteProduct, getAllProducts, getProductDetails, updateProduct } from '../controllers/productController.js';
import adminAuth from '../middlewares/adminAuth.js';
import upload from '../middlewares/multer.js';
import { addReview, getProductReviews } from '../controllers/reviewController.js';
import userAuth from '../middlewares/userAuth.js';

const productRouter = express.Router();

productRouter.get('/all', getAllProducts);
productRouter.get('/:id', getProductDetails);
productRouter.post('/add', upload.array('images', 4), adminAuth, addProduct);
productRouter.put('/update/:id', upload.array('images', 4), adminAuth, updateProduct);
productRouter.delete('/delete/:id', adminAuth, deleteProduct);

productRouter.get('/:productId/reviews', getProductReviews);
productRouter.post('/:productId/review', upload.single("image"), userAuth, addReview);

export default productRouter