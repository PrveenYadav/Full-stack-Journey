import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product"
  },
  quantity: {
    type: Number,
    required: true
  }
})

const orderSchema = new mongoose.Schema({
  Orderprice: {
    type: Number,
    required: true
  },
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  orderItems: {
    type: [orderItemSchema]
  },
  address: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ["PENDING", "CANCELLED", "DELIVERED"], // enum means choices
    default: "PENDING",
  }
}, {timestamps: true})

// enum means that the status can only be one of the following values

export const Order = mongoose.model("Order", orderSchema);