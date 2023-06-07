const express = require("express");
const router = express.Router();
const product = require("../controllers/product");
const userValidator = require("../controllers/userValidator");

router.get("/", product.getAllProducts);
router.get("/:id", product.getProduct);
router.get("/category/:category", product.getProductsInCategory);
router.post("/", userValidator.adminValidator, product.addProduct);
router.put("/:id", userValidator.adminValidator, product.editProduct);
router.patch("/:id", userValidator.adminValidator, product.editProduct);
router.delete("/:id", userValidator.adminValidator, product.deleteProduct);

module.exports = router;
