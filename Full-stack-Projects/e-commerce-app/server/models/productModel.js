import mongoose, { Schema } from "mongoose";


const reviewSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false // optional if guest reviews allowed
    },

    _id: { type: mongoose.Schema.Types.ObjectId, auto: true },

    name: {
        type: String,
    },

    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5
    },
    comment: {
      type: String,
      trim: true
    },
    image: {
      type: String //ImageKit URL
    },
    date: {
      type: Date,
      default: Date.now
    }
  },
  { _id: false }
);

const productSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    images: [
        {
            public_id: {
                type: String,
                required: true
            },
            url: {
                type: String,
                required: true
            }
        }
    ],
    price: {
        type: Number,
        required: true,
    },
    category: { 
        type: String,
        enum: ['Men', 'Women'],
        required: true,
        index: true 
    },
    subCategory: { 
        type: String, 
        required: true, 
        index: true // e.g., 'Hoodies', 'Dresses'
    },
    stock: {
        type: Number,
        default: 10
    },
    variants: [
        {
            color: { type: String, required: true },
            size: { type: String, required: true },
            stock: { type: Number, default: 10 },
            imageIndex: { type: Number, required: true }
        }
    ],

    isFeatured: { type: Boolean, default: false },
    tags: [String],
    isNewArrival: { type: Boolean, default: false },
    discountPercentage: Number,
    soldCount: { type: Number, default: 0 }, // bestseller logic

    reviews: [reviewSchema],
    averageRating: {
      type: Number,
      default: 4.2
    },
    ratingUsers: {
        type: Number,
        default: 0,
    },

}, {timestamps: true});


export const Product = mongoose.model("Product", productSchema);