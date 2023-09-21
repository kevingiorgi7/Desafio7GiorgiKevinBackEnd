import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
    user: {
        type: String
    },
    message: {
        type: String
    },
});

export const messageModel = mongoose.model("message", messageSchema);

