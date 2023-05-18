const mongoose = require('mongoose');
const schema = mongoose.Schema;
const User = require('./user');
const Product = require('./product');

const cartSchema = new schema({
    id: {
        type: Number,
        required: true
    },
    userId: {
        type: Number,
        ref: User,
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    products: [{
        productId: {
            type: Number,
            ref: Product,
            required: true
        },
        quantity: {
            type: Number,
            required: true
        }
    }]
})

module.exports = mongoose.model('cart', cartSchema);