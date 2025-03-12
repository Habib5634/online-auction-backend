const mongoose = require('mongoose')

const productSchema = new mongoose.Schema({
    sellerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    productName: {
        type: String,
    },
    productCompany: {
        type: String,
    },
    location: {
        type: String,
    },
    productCategory: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "ProductCategory",
        required: true,
    },
    productType: {
        type: String,
        enum: ['used', 'new'],
        default:'new'
    },
    shippingStatus: {
        type: String,
        enum: ['pending', 'processing',"shipped",'delivered'],
        default:'pending'
    },
    price: {
        type: Number,
    },
    images: {
        type: [],
    },
    description1: {
        type: String,
    },
    description2: {
        type: String
    },
    description3: {
        type: String,
    },
  
    isOpen: {
        type: Boolean,
        default:true
    },
    startDate: {
        type: Date,
        required: true, 
    },
    endDate: {
        type: Date,
        required: true,
    }

}, { timestamps: true })

module.exports = mongoose.model('Products', productSchema)