const Product = require("../models/product");

module.exports.getAllProducts = async (req, res) => {
  try {
    let limit = Number(req.query.limit);
    let sort = req.query.sort == "desc" ? -1 : 1;

    const products = await Product.find()
      .select()
      .limit(limit)
      .sort({ id: sort });
    res.json(products);
  } catch {
    res.status(500).json({ message: "Fail to fetch products!" });
  }
};

module.exports.getProduct = async (req, res) => {
  try {
    let id = req.params.id;
    const products = await Product.findById(id).select();

    if (!products) {
      res.status(404).json({ message: "Fail to get product!" });
    } else {
      res.json(products);
    }
  } catch {
    res.status(500).json({ message: "Fail to fetch product!" });
  }
};

module.exports.getProductCategories = async (req, res) => {
  try {
    const products = await Product.distinct("category").then((categories) => {
      res.json(categories);
    });
  } catch {
    res.status(500).json({ message: "Fail to fetch product category!" });
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
    res.status(500).json({ message: "Fail to fetch products!" });
  }
};

module.exports.addProduct = async (req, res) => {
  try {
    const { title, price, description, image, category } = req.body;

    if (!req.body) {
      return res.status(400).json({
        status: "error",
        message: "Provide all required fields.",
      });
    }
    const product = await Product.create({
      title,
      price,
      description,
      image,
      category,
    });
    res.json(product);
  } catch {
    res.status(500).json({ message: "Fail to add product!" });
  }
};

module.exports.editProduct = async (req, res) => {
  try {
    if (typeof req.body == undefined || req.params.id == null) {
      return res.status(400).json({
        status: "error",
        message: "Provide product to edit.",
      });
    }
    const product = await Product.findByIdAndUpdate(req.body);
    res.json(product);
  } catch {
    res.status(500).json({ message: "Fail to edit product!" });
  }
};

module.exports.deleteProduct = async (req, res) => {
  try {
    if (req.params.id == null) {
      return res.status(400).json({
        status: "error",
        message: "Provide id",
      });
    } else {
      const product = await Product.deleteOne({ _id: req.params.id });
      res.json(product);
    }
  } catch {
    res.status(500).json({ message: "Fail to delete product!" });
  }
};
