const Cart = require('../models/cart');
// dúvidas se tenho de importar o model do user por causa do userId, visto que no model do Cart, há a referência do model do User para o campo userId
// Dúvida se vai acontecer o mesmo para o productId

module.exports.getAllCarts = async(req, res) => {
    try {
        let carts = await Cart.find();
        res.json(carts);
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: 'error fetching all carts.' });
    }
};

//Dúvida
module.exports.getCartsByUserId = async(req, res) => {
    try {
        let userId = req.params.userId;
        let cart = await Cart.findById(userId).select();

        if (!cart) {
            res.status(404).json({ message: 'failed to get user cart' });
        } else {
            res.json(cart);
        }
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: 'error fetching User cart.' });
    }
};

module.exports.getCartById = async(req, res) => {
    try {
        let id = req.params.id;
        let cart = await Cart.findById(id).select();

        if (!cart) {
            res.status(404).json({ message: 'failed to get cart' });
        } else {
            res.json(cart);
        }
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: 'error fetching cart.' });
    }
};