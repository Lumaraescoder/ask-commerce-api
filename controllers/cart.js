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

module.exports.addCart = async(req, res) => {
    try {
        const { id, userId, date, products } = req.body;
        if (!id || !userId || !date || !products) {
            return res
                .status(400)
                .json({ message: "something's missing", status: 'Error' });
        } else {
            const cart = await Cart.create({
                id,
                userId,
                date,
                products,
            });

            res.json(cart);
        }
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: 'error adding cart.' });
    }
}

module.exports.deleteCart = async(req, res) => {
    try {
        if (req.params.id == null) {
            res.json({
                status: 'error',
                message: 'cart id should be provided',
            });
        } else {
            const cart = await Cart.deleteOne({ _id: req.params.id });
            res.json(cart);
        }
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: 'error deleting cart.' });
    }
}

module.exports.editCart = async(req, res) => {
    try {
        const id = req.params.id;
        const cart = await Cart.findByIdAndUpdate(id, req.body);
        res.json(cart);
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: 'error editing cart.' });
    }
}