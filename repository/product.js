const Product = require("../models/product");

const getAllProducts = async (limit, sort) => {
  try {
    return await Product.find()
      .select("-image")
      .limit(limit)
      .sort({ id: sort });
  } catch (err) {
    throw err;
  }
};

const getProductCategories = async () => {
  try {
    return await Product.distinct("category");
  } catch (error) {
    throw error;
  }
};

const getProduct = async (id) => {
  try {
    return await Product.findById(id).select();
  } catch (err) {
    throw err;
  }
};

const getProductsInCategory = async (category) => {
  try {
    return await Product.find({
      category,
    });
  } catch (err) {
    throw err;
  }
};

const addProduct = async (productData) => {
  try {
    return await Product.create(productData);
  } catch (err) {
    throw err;
  }
};

const editProduct = async (id, productData) => {
  try {
    return await Product.findByIdAndUpdate(id, productData, { new: true });
  } catch (err) {
    throw err;
  }
};

const deleteProduct = async (id) => {
  try {
    return await Product.deleteOne({ _id: id });
  } catch (err) {
    throw err;
  }
};

module.exports = {
  getAllProducts,
  getProductCategories,
  getProduct,
  getProductsInCategory,
  addProduct,
  editProduct,
  deleteProduct,
};
