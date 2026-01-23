import { Order } from "../models/orderModel.js";


export const createOrder = async (req, res) => {

    // console.log("User Id: ", req.userId);

  try {
    const { items, orderInfo, paymentInfo, totals } = req.body;

    console.log(req.body)

    if (!items || items.length === 0) {
      return res.status(400).json({ message: "Order items missing" });
    }

    const order = await Order.create({
    //   user: req.user?._id,
      user: req.userId,
      items,
      orderInfo,
      paymentInfo,
      totalAmount: totals.grandTotal
    });

    res.status(201).json({
      success: true,
      orderId: order.orderId,
      order
    });
  } catch (err) {
    console.error("Order error", err);
    res.status(500).json({ message: err.message });
  }
};

// get logged-in User Orders
export const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.userId })
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: orders.length,
      orders
    });
  } catch (error) {
    console.error("Getting my order error: ", error);
    res.status(500).json({ message: error.message });
  }
};

// cancel order
export const cancelOrderByUser = async (req, res) => {
  try {
    const userId = req.userId; // from auth middleware

    const order = await Order.findOne({
      orderId: req.params.orderId,
      user: userId
    });

    if (!order) {
      return res.status(404).json({
        message: "Order not found"
      });
    }

    const nonCancelableStatuses = ["shipped", "delivered", "cancelled"];

    if (nonCancelableStatuses.includes(order.status)) {
      return res.status(400).json({
        message: `Order cannot be cancelled once ${order.status}`
      });
    }

    order.status = "cancelled";
    order.cancelledBy = "user"; // optional but useful
    order.cancelledAt = new Date();

    if (order.paymentInfo.method !== "cod") {
      order.paymentInfo.status = "refund_pending";
    }

    await order.save();

    res.status(200).json({
      success: true,
      message: "Order cancelled successfully",
      order
    });
  } catch (error) {
    console.error("Cancel order Error: ", error);
    res.status(500).json({
      message: error.message
    });
  }
};

// get single rrder by orderId
export const getOrderByOrderId = async (req, res) => {
  try {
    const order = await Order.findOne({ orderId: req.params.orderId }).populate("user", "name email");
    // const order = await Order.findOne({ orderId: req.params.orderId }).populate("user", "name email");

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // optional: it prevent users from accessing other's orders
    if (order.user.toString() !== req.userId) {
      return res.status(403).json({ message: "Not authorized" });
    }

    res.json({
      success: true,
      order
    });
  } catch (error) {
    console.error("Get order error 👉", error);
    res.status(500).json({ message: error.message });
  }
};


