let express = require("express");
let router = express.Router();
let cart = require("../controllers/cart");

router.get("/", cart.getAllCarts);
router.get("/carts/user/:userId", cart.getCartsByUserId);
router.get("/carts/:id", cart.getCartById);
router.post("/carts", cart.addCart);
router.delete("/carts/:id", cart.deleteCart);
router.put("/carts/editCart/:id", cart.editCart);

module.exports = router;