import mongoose, { Schema } from "mongoose";

const adminShema = new Schema({
    name: {
        type: String,
        default: ""
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    profileImage: {
        type: String,
        default: ""
    },
    role: {
        type: String,
        default: "Admin Manager"
    }
}, {timestamps: true})

export const Admin = mongoose.model("Admin", adminShema)