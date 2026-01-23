import express from 'express';
import userAuth from '../middlewares/userAuth.js';
import { cancelOrderByUser, createOrder, getMyOrders, getOrderByOrderId, getOrderDetails, myOrders, newOrder } from '../controllers/orderController.js';

const orderRouter = express.Router();

orderRouter.post('/create', userAuth, createOrder);
orderRouter.get('/my-orders', userAuth, getMyOrders);
orderRouter.get('/:orderId', userAuth, getOrderByOrderId);
orderRouter.put('/:orderId/cancel', userAuth, cancelOrderByUser);

export default orderRouter