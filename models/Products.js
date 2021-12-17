const mongoose = require('mongoose')

const ProductSchema = new mongoose.Schema({
    product_id: {
        type: mongoose.Schema.Types.ObjectId,
    },
    product_name: {
        type: String,
        required: true,
        unique: true
    },
    product_type: {
        type: String,
        required: true,
    },
    product_size: {
        type: [String],
        required: true
    },
    product_price: {
        type: Number,
        required: true,
    },
    product_description: {
        type: String,
        length: 200,
        required: true
    },
    product_color: {
        type: [String],
        required: true
    },
    product_img_urls: {
        type: [String],
        required: true
    }

})

module.exports = Product = mongoose.model('product', ProductSchema)