import mongoose from "mongoose"

// Data Modeling of todos with mongoose
// Schema is a blueprint for the data structure
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
  }
  
}, {timestamps: true})

export const User = mongoose.model("User", userSchema)