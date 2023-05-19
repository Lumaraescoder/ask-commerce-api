const mongoose = require('mongoose');
const schema = mongoose.Schema;

const categorySchema = new schema({
  id: {
    type: Number,
    required: false,
  },
  title: {
    type: String,
    required: true,
  },
  price: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  rating: {
    type: Number,
    required: true,
  },
});


module.exports = mongoose.model('category', categorySchema);
