import mongoose, { Schema } from "mongoose";

const noteSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        // required: true,
    },
})

export const Notes = mongoose.model('Notes', noteSchema);
