const Category = require('../models/category');


module.exports.getAllCategories = async (req, res) => {
    try {
      const categories = await Category.find();
      res.json(categories);
    } catch (err) {
      console.log(err);
      res.status(500).json({ message: 'error fetching all categories.' });
    }
  };

  module.exports.getCategory = async (req, res) => {
    try {
      const id = req.params.id;
      const category = await Category.findById(id).select();
  
      if (!category) {
        res.status(404).json({ message: 'failed to get category' });
      } else {
        res.json(category);
      }
    } catch (err) {
      console.log('getCategory ->', err);
    }
  };


  module.exports.addCategory = async (req, res) => {
    try {
      const { title, price, description, category, image, rating } = req.body;
      if (!title || !price || !description || !category || !image || !rating) {
        return res
          .status(400)
          .json({ message: "something's missing", status: 'Error' });
      }
  
      const createCategory = await Category.create({
        title,
        price,
        description,
        category,
        image,
        rating,
      });
  
      res.json(createCategory);
    } catch (err) {
      res.status(500).json({ message: 'error creating a category' });
    }
  };


module.exports.deleteCategory = async (req, res) => {
    try {
      if (req.params.id == null) {
        res.json({
          status: 'error',
          message: 'cart id should be provided',
        });
      } else {
        const category = await Category.deleteOne({ _id: req.params.id });
        res.json(category);
      }
    } catch (err) {
      console.log('deleteCategory ->', err);
    }
  };
  
  module.exports.editCategory = async (req, res) => {
    try {
      const id = req.params.id;
      const category = await Category.findByIdAndUpdate(id, req.body);
      res.json(category);
    } catch (err) {
      console.log('editCategory error -> ', err);
    }
  };
  

  