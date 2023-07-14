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
    const productId = req.params.productId;

    try {
        let cart;

        if (userId) {
            cart = await Cart.findOne({ userId });
        }

        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }

        const productIndex = cart.products.findIndex((p) => p.productId === productId);

        if (productIndex === -1) {
            return res.status(404).json({ message: 'Product not found in cart' });
        }

        const product = cart.products[productIndex];

        if (product.quantity > 1) {
            product.quantity -= 1;
            cart.total -= product.price;
        } else {
            cart.products.splice(productIndex, 1);
            cart.total -= product.price;
        }

        if (cart.products.length === 0) {
            // Se o carrinho estiver vazio, remover o carrinho
            await Cart.deleteOne({ userId });
            return res.json({ message: 'Product removed successfully from cart and cart deleted' });
        }

        await cart.save();

        res.json({ message: 'Product removed successfully from cart', cart });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Failed to remove product from cart', error: err });
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