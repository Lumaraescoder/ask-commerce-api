const Product = require("../models/product");

module.exports.getAllProducts = async (req, res) => {
  try {
    const limit = Number(req.query.limit);
    const sort = req.query.sort == "desc" ? -1 : 1;

    const products = await Product.find()
      .select()
      .limit(limit)
      .sort({ id: sort })
      .then((products) => {
        res.json(products);
      });
  } catch {
    console.log(err);
  }
};

module.exports.getProduct = async (req, res) => {
  try {
    let id = req.params.id;

    const products = await Product.findById(id)
      .select(["-_id"])
      .then((product) => {
        res.json(product);
      });
  } catch {
    console.log(err);
  }
};

module.exports.getProductCategories = async (req, res) => {
  try {
    const products = await Product.distinct("category").then((categories) => {
      res.json(categories);
    });
  } catch {
    console.log(err);
  }
};

module.exports.getProductsInCategory = async (req, res) => {
  try {
    let category = req.params.category;
    let limit = Number(req.query.limit);
    let sort = req.query.sort == "desc" ? -1 : 1;

    const products = await Product.find({
      category,
    })
      .select(["-_id"])
      .limit(limit)
      .sort({ id: sort })
      .then((products) => {
        res.json(products);
      });
  } catch {
    console.log(err);
  }
};

module.exports.addProduct = async (req, res) => {
  if (typeof req.body == undefined) {
    res.json({
      status: "error",
      message: "data undefined",
    });
  } else {
    const product = {
      title: req.body.title,
      price: req.body.price,
      description: req.body.description,
      image: req.body.image,
      category: req.body.category,
    };

    const products = await Product.collection.insertOne(product);
    res.json(product);
  }
};

module.exports.editProduct = async (req, res) => {
  if (typeof req.body == undefined || req.params.id == null) {
    res.json({
      status: "error",
      message: "something went wrong!",
    });
  } else {
    const products = await Product.findByIdAndUpdate(req.params.id, req.body)
      .then((product) => {
        res.json(product);
      })
      .catch((err) => console.log(err));
  }
};

module.exports.deleteProduct = async (req, res) => {
  if (req.params.id == null) {
    res.json({
      status: "error",
      message: "insert product ID",
    });
  } else {
    const products = await Product.deleteOne({
      _id: req.params.id,
    })
      .then((product) => {
        res.json(product);
      })
      .catch((err) => console.log(err));
  }
};
