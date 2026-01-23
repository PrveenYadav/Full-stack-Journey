import mongoose, { Schema } from "mongoose";

// const orderSchema = new Schema({
//     // 1. USER REFERENCE
//     user: {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: 'User', 
//         required: true
//     },
    
//     // 2. ITEMS ORDERED (CRITICAL)
//     orderItems: [
//         {
//             name: { type: String, required: true },
//             quantity: { type: Number, required: true },
//             image: { type: String, required: true }, // URL of the main product image
//             price: { type: Number, required: true }, // Price AT TIME OF PURCHASE
//             product: { // Reference to the Product Model
//                 type: mongoose.Schema.Types.ObjectId,
//                 ref: 'Product', 
//                 required: true
//             },
//         }
//     ],

//     // 3. SHIPPING ADDRESS (Embedded)
//     shippingInfo: { 
//         recipientName: { type: String, required: true },
//         phoneNumber: { type: String, required: true },
//         fullAddress: { type: String, required: true },
//         town: { type: String, required: true },
//         city: { type: String, required: true },
//         district: { type: String },
//         state: { type: String, required: true },
//         pincode: { type: String, required: true },
//     },
    
//     // 4. ORDER FINANCES
//     itemsPrice: { type: Number, required: true, default: 0 },
//     taxPrice: { type: Number, required: true, default: 0 },
//     shippingPrice: { type: Number, required: true, default: 0 },
//     totalPrice: { type: Number, required: true, default: 0 },

//     // 5. STATUS AND PAYMENT
//     orderStatus: {
//         type: String,
//         required: true,
//         default: 'Processing'
//     },
//     paidAt: {
//         type: Date
//     },
//     paymentInfo: { // Store transaction ID, payment method, etc.
//         id: { type: String }, 
//         status: { type: String }
//     },

// }, {timestamps: true});

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
    // required: true
  },
});

const orderInfoSchema = new mongoose.Schema({
  name: String,
  email: String,
  phone: String,
  address: String,
  city: String,
  state: String,
  pincode: String
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
            "pending",
            "confirmed",
            "processing",
            "shipped",
            "delivered",
            "cancelled",
            "paid"
        ],
        default: "pending"
      }
    },

    totalAmount: {
      type: Number,
      required: true
    },

    status: {
      type: String,
      default: "pending"
    }

}, { timestamps: true });

orderSchema.pre("save", function (next) {
  if (!this.orderId) {
    this.orderId = `ORD-${Date.now()}`;
  }
  next();
});


export const Order = mongoose.model('Order', orderSchema);