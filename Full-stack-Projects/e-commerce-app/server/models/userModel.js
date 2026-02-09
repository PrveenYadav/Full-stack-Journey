import mongoose, { Schema } from "mongoose";

const AddressSchema = new mongoose.Schema({
  type: { type: String, enum: ['Home', 'Work', 'Other'], default: 'Home' },

  fullName: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String },

  street: { type: String, required: true },
  city: { type: String, required: true },
  zip: { type: String, required: true },
  country: { type: String, default: 'India' },

  isDefault: { type: Boolean, default: false }
});

const userSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    googleId: String,
    password: {
        type: String,
        required: false,
    },
    // password: {
    //     type: String,
    //     required: function() { return !this.googleId; } // Only required if not using Google
    // },
    profileImage: {
        type: String,
        default: ""
    },
    phone: {
        type: String,
        default: ""
    },
    bio: {
        type: String,
        default: ""
    },
    birthDate: {
        type: String,
        default: ""
    },
    wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
    addresses: [AddressSchema],

    isVerified: {
        type: Boolean,
        default: false
    },
    verifyOtp: {
        type: String,
        default: ''
    },    
    verifyOtpExpireAt: {
        type: Number,
        default: 0
    },
    isAccountVerified: {
        type: Boolean,
        default: false
    },
    resetOtp: {
        type: String,
        default: ''
    },
    resetOtpExpireAt: {
        type: Number,
        default: 0
    },
}, {timestamps: true})

export const User = mongoose.model('User', userSchema)