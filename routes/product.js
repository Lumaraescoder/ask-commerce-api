const express = require("express");
const router = express.Router();
const product = require("../controllers/product");
const userValidator = require("../controllers/userValidator");
const multer = require("multer");


const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/')
    },
    filename: function(req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now())
    }
});

const upload = multer({ storage: storage });

router.get("/", product.getAllProducts);
router.get("/:id", product.getProduct);
router.get("/category/:category", product.getProductsInCategory);
router.post("/", userValidator.adminValidator, upload.single('image'), product.createProduct);
//router.post("/", userValidator.adminValidator, product.addProduct);
router.put("/:id", userValidator.adminValidator, product.editProduct);
router.patch("/:id", userValidator.adminValidator, product.editProduct);
router.delete("/:id", userValidator.adminValidator, product.deleteProduct);

module.exports = router;