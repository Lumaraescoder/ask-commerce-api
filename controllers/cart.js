const cart = require('../models/cart');
const Cart = require('../models/cart');
const Product = require('../models/product');

module.exports.getAllCarts = async(req, res, next) => {
    try {
        let carts = await Cart.find();
        res.json(carts);
    } catch (err) {
        next(err);
    }
};

module.exports.getCartsByUserId = async(req, res, next) => {
    try {
        let userId = req.params.userId;
        let cart = await Cart.findOne({ userId }).select();
        res.json(cart);
    } catch (err) {
        next(err);
    }
};

module.exports.getCartById = async(req, res, next) => {
    try {
        let id = req.params.id;
        let cart = await Cart.findById(id).select();
        res.json(cart);
    } catch (err) {
        next(err);
    }
};

module.exports.addCart = async(req, res) => {
    try {
        const { userId, products } = req.body;

        let cart;

        if (userId) {
            cart = await Cart.findOne({ userId });
        }

        if (!cart) {
            cart = new Cart({ userId, products: [], total: 0 });
        }

        let productToAdd = (req.body.products[0].productId).toString();
        let quantityOfProductToAdd = req.body.products[0].quantity;

        let isProductAlreadyInCart = await cart.products.find(product => product.productId === `${productToAdd}`);

        if (isProductAlreadyInCart === undefined) {

            for (const product of products) {
                const { productId, title, quantity, price } = product;

                if (!productId || !title) {
                    continue;
                }
                cart.products.push({ productId, title, quantity, price });

                cart.total += quantity * price;
            }
        } else {
            isProductAlreadyInCart.quantity += quantityOfProductToAdd;
            cart.total += quantityOfProductToAdd * isProductAlreadyInCart.price;
        }

        await cart.save();


        res.status(201).json({ message: 'Cart with product added successfully', cart });

    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Failed to add cart with product", err });
    }
};

module.exports.deleteProductFromCart = async(req, res) => {
    const userId = req.params.userId;
    const productParamId = req.params.productId;
    try {

        let cart;

        if (userId) {
            cart = await Cart.findOne({ userId });
        }

        if (!cart) {
            res.status(500).json({ message: "Failed to find cart for this user", err });
        }

        if (!productParamId) {
            res.status(500).json({ message: "Failed to find product on this cart", err });
        }

        if (productParamId) {
            let selectedProduct = await cart.products.find(product => product.productId === `${productParamId}`);
            if (selectedProduct === undefined) {
                res.status(500).json({ message: "Failed to find product on this cart", err });
            } else {

                if (selectedProduct.quantity > 1) {
                    selectedProduct.quantity -= 1;
                    cart.total -= selectedProduct.price;
                } else {
                    let indexOfSelectedProduct = cart.products.indexOf(selectedProduct);
                    cart.products.splice(indexOfSelectedProduct, 1);
                    cart.total -= selectedProduct.quantity * selectedProduct.price;
                }
            }
        }
        if (cart.products.length < 1) {
            const cart = await Cart.deleteOne({ userId: req.params.userId });
            res.status(200).json({ message: 'Product removed successfully from cart and cart deleted' });
        } else {
            await cart.save();
            res.status(200).json({ message: 'Product removed successfully from cart', cart });
        }

    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Failed to remove product from cart", err });
    }
};

module.exports.deleteFullCart = async(req, res, next) => {
    try {
        const cart = await Cart.deleteOne({ _id: req.params.id });
        res.json(cart);
    } catch (err) {
        next(err);
    }
};