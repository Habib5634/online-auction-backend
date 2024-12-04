const mongoose = require('mongoose')

const bidSchema = new mongoose.Schema({
    bidderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Products",
        required: true,
    },
    bidStatus:{
        type: String,
        enum: ['running', 'winner', 'closed'],
        default:'running'
    },
    bidPrice:{
        type:Number,
    }
    

}, { timestamps: true })

module.exports = mongoose.model('Bid', bidSchema)