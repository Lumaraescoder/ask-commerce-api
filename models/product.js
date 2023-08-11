const mongoose = require("mongoose");
const schema = mongoose.Schema;

const productSchema = new schema({
    id: {
        type: String,
        required: false,
    },
    title: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    category: {
        type: String,
        required: true,
        trim: true,
        enum: ["Eletronics", "Books", "Clothing", "Other"],
    },
    description: {
        type: String,
        required: true,
    },
    image: {
        data: Buffer,
        contentType: String,
    },
    rating: {
        rate: {
            type: Number,
            required: false,
        },
        count: {
            type: Number,
            required: false,
        }
    }
});

module.exports = mongoose.model("product", productSchema);