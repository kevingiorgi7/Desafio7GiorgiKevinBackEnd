import mongoose from "mongoose";
import mongoosePaginate from 'mongoose-paginate-v2';

const productsSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        unique: true,
        index: true
    },
    description: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    thumbnail: {
        type: Object,
    },
    code: {
        type: String,
        required: true,
        unique: true,
    },
    stock: {
        type: Number,
        default: 0,
    },
    status: {
        type: Boolean,
        default: true,
    },
    category: {
        type: String,
        required: true,
        index: true
    },
});

productsSchema.plugin(mongoosePaginate)

export const productsModel = mongoose.model('products', productsSchema)