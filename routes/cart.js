let express = require("express");
let router = express.Router();
let cart = require("../controllers/cart");

router.get("/allCarts", cart.getAllCarts);
router.post("/addCart/:userId", cart.addCart);
router.delete("/carts/:userId/:productId", cart.deleteProductFromCart);
router.get("/carts/user/:userId", cart.getCartsByUserId);
router.get("/carts/:id", cart.getCartById);
router.delete("/deleteCart/:id", cart.deleteFullCart)

module.exports = router;