const mongoose = require('mongoose');
const schema = mongoose.Schema;
const User = require('./user');
const Product = require('./product');

const cartSchema = new schema({
    userId: {
        type: String,
        ref: User,
        required: true
    },
    products: [{
        productId: {
            type: String,
            ref: Product,
            required: true
        },
        title: {
            type: String,
            ref: Product,
            required: true
        },
        quantity: {
            type: Number,
            required: true,
            min: 1,
            default: 1
        },
        price: {
            type: Number,
            ref: Product,
            required: true
        }
    }],
    total: {
        type: Number,
        required: true,
        default: 0
    }
})

module.exports = mongoose.model('cart', cartSchema);