import mongoose from 'mongoose';

// Schema is a blueprint for the data structure
const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        minlength: 3,
        maxlength: 20,
    }
}, {timestamps: true,})

export const User = mongoose.model('User', userSchema)