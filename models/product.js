const mongoose = require("mongoose");
const schema = mongoose.Schema;

const productSchema = new schema({
  id: {
    type: Number,
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
    enum: ['Eletronics', 'Books', 'Clothing', 'Other'],
  },
  description: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("product", productSchema);
