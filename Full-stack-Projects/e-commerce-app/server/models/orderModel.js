import mongoose, { Schema } from "mongoose";

const orderItemSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true
  },
  name: String,
  category: String,
  price: Number,
  quantity: Number,
  image: {
    type: String, 
  },
  color: { type: String },
  size: { type: String },
});

const orderInfoSchema = new mongoose.Schema({
  name: String,
  email: String,
  phone: String,
  pincode: String,
  street: String,
  city: String,
  country: String,
  address: String,
  state: String,
});


const orderSchema = new mongoose.Schema({
    orderId: String,

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },

    items: [orderItemSchema],

    orderInfo: orderInfoSchema,

    paymentInfo: {
      method: {
        type: String,
        enum: ["cod", "card", "upi"],
        required: true
      },
      status: {
        type: String,
        enum: [
            "Pending",
            "Failed",
            "Paid"
        ],
        default: "Pending"
      }
    },

    totalAmount: {
      type: Number,
      required: true
    },

    status: {
      type: String,
      enum: ['Processing', 'Shipped', 'Delivered', 'Cancelled'],
      default: "Processing"
    },
}, { timestamps: true });


orderSchema.pre("save", function (next) {
  if (!this.orderId) {
    this.orderId = `ORD-${Date.now()}`;
  }
  next();
});

export const Order = mongoose.model('Order', orderSchema);