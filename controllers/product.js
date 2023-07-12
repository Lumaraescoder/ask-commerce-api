const multer = require("multer");
const upload = multer().single("image");

const {
  getAllProducts,
  getProductCategories,
  getProduct,
  getProductsInCategory,
  addProduct,
  editProduct,
  deleteProduct,
} = require("../repository/product");

module.exports.getAllProducts = async (req, res, next) => {
  try {
    let limit = Number(req.query.limit);
    let sort = req.query.sort == "desc" ? -1 : 1;

    const products = await getAllProducts(limit, sort);
    res.json(products);
  } catch (err) {
    next(err);
  }
};

module.exports.getProductCategories = async (req, res) => {
  try {
    const categories = await getProductCategories();
    res.json(categories);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to fetch product categories!", error });
  }
};

module.exports.getProduct = async (req, res) => {
  try {
    let id = req.params.id;
    const product = await getProduct(id);

    if (!product) {
      res.status(404).json({ message: "Fail to get product!" });
    } else {
      let modifiedProduct = { ...product.toObject() };

      if (modifiedProduct.image) {
        modifiedProduct.image = "yes";
      } else {
        modifiedProduct.image = "no";
      }

      res.json(modifiedProduct);
    }
  } catch (error) {
    res.status(500).json({ message: "Fail to fetch product!", error });
  }
};

module.exports.getProductsInCategory = async (req, res, next) => {
  try {
    let category = req.params.category;

    const products = await getProductsInCategory(category);

    const modifiedProducts = products.map((product) => {
      const hasImage =
        product.image && product.image.data && product.image.data.length > 0
          ? "yes"
          : "no";
      const modifiedProduct = { ...product._doc, image: hasImage };
      return modifiedProduct;
    });

    res.json(modifiedProducts);
  } catch (error) {
    res.status(500).json({ message: "Fail to fetch products!", error });
  }
};

module.exports.addProduct = async (req, res, next) => {
  try {
    upload(req, res, async function (err) {
      if (err) {
        console.error(err);
        return res.status(500).json({
          status: "error",
          message: "Error uploading image.",
        });
      }

      const { title, price, description, category } = req.body;

      if (!title || !price || !description || !category) {
        return res.status(400).json({
          status: "error",
          message: "Provide all required fields.",
        });
      }

      const productData = {
        title,
        price,
        description,
        category,
      };

      if (req.file) {
        productData.image = {
          data: req.file.buffer,
          contentType: req.file.mimetype,
        };
      }

      const product = await addProduct(productData);

      return res.status(200).json({
        status: "success",
        message: "Product added!",
      });
    });
  } catch (err) {
    console.error(err);
    next(err);
  }
};

module.exports.editProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, price, description, image, category } = req.body;

    if (!title && !price && !description && !image && !category) {
      return res.status(400).json({
        status: "error",
        message: "Provide at least one field to edit the product.",
      });
    }

    const productData = {
      title,
      price,
      description,
      image,
      category,
    };

    const product = await editProduct(id, productData);

    return res.status(200).json({
      status: "success",
      message: "Product updated!",
    });
  } catch (err) {
    next(err);
  }
};

module.exports.deleteProduct = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        status: "error",
        message: "Provide product ID.",
      });
    }

    await deleteProduct(id);
    res.status(200).json({ message: "Product deleted!" });
  } catch (err) {
    next(err);
  }
};
