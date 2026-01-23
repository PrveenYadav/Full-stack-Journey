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
        // type: mongoose.Schema.Types.ObjectId,
        type: String,
        // ref: "User",
        // required: true
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
    // images: {
    //     type: [String], // list of images
    //     required: true,
    // },
    images: [
        {
            public_id: {
                type: String, // this is coming from imagekit
                required: true
            },
            url: {
                type: String, // and the public image url from imagekit
                required: true
            }
        }
    ],
    price: {
        type: String,
        required: true,
        default: "₹99"
    },
    category: {
        type: String,
        default: "pizza",
    },
    stock: {
        type: Number,
        default: 10
    },


    ratings: {
        type: Number,
        default: 4.2
        // default: "★★★★⯪"
    },

    reviews: [reviewSchema],

    averageRating: {
      type: Number,
      default: 4.2
    },
    ratingUsers: {
        type: Number,
        default: 0,
        // default: 135
    },


    calories: {
        type: String,
        default: "840 kcal"
    },
    ingredients: {
        type: [String],
        default: ["Black Truffle", "Aged Gruyère", "Brioche", "Balsamic Onions", "Arugula"]
    },
    nutrients: [
        {
            label: {
                type: String,
                default: "Protien"
            },
            value: {
                type: String,
                default: "45g"
            },
        }
    ],

}, {timestamps: true});


export const Product = mongoose.model("Product", productSchema);