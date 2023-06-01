const Cart = require('../models/cart');
const Product = require('../models/product');
// dúvidas se tenho de importar o model do user por causa do userId, visto que no model do Cart, há a referência do model do User para o campo userId
// Dúvida se vai acontecer o mesmo para o productId

module.exports.getAllCarts = async(req, res, next) => {
    try {
        let carts = await Cart.find();
        res.json(carts);
    } catch (err) {
        next(err);

        // console.log(err);
        // res.status(500).json({ message: 'error fetching all carts.' });
    }
};

//Dúvida
module.exports.getCartsByUserId = async(req, res, next) => {
    try {
        let userId = req.params.userId;
        let cart = await Cart.findById(userId).select();

        //if (!cart) {
        //res.status(404).json({ message: 'failed to get user cart' });
        //} else {
        res.json(cart);
        //}
    } catch (err) {
        next(err);

        //console.log(err);
        //res.status(500).json({ message: 'error fetching User cart.' });
    }
};

module.exports.getCartById = async(req, res, next) => {
    try {
        let id = req.params.id;
        let cart = await Cart.findById(id).select();

        //if (!cart) {
        //    res.status(404).json({ message: 'failed to get cart' });
        //} else {
        res.json(cart);
        //}
    } catch (err) {
        next(err);

        //console.log(err);
        //res.status(500).json({ message: 'error fetching cart.' });
    }
};

// module.exports.addCart = async(req, res, next) => {
//     try {
//         const { userId, products, total } = req.body;
//         if (products == [] || products[0].quantity < 1) {
//             return res
//                 .status(400)
//                 .json({ message: "products missing", status: 'Error' });
//         } else {
//             const cart = await Cart.create({
//                 userId,
//                 products,
//                 total
//             });

//             res.json(cart);
//         }
//     } catch (err) {
//         next(err);

//         //console.log(err);
//         //res.status(500).json({ message: 'error adding cart.' });
//     }
// }

// module.exports.deleteCart = async(req, res, next) => {
//     try {
//         //if (req.params.id == null) {
//         //    res.json({
//         //        status: 'error',
//         //        message: 'cart id should be provided',
//         //    });
//         //} else {
//         const cart = await Cart.deleteOne({ _id: req.params.id });
//         res.json(cart);
//         //}
//     } catch (err) {
//         next(err);

//         //console.log(err);
//         //res.status(500).json({ message: 'error deleting cart.' });
//     }
// }

module.exports.editCart = async(req, res, next) => {
    try {
        const id = req.params.id;
        const cart = await Cart.findByIdAndUpdate(id, req.body);
        res.json(cart);
    } catch (err) {
        next(err);

        //console.log(err);
        //res.status(500).json({ message: 'error editing cart.' });
    }
}

module.exports.addItemToExistingCart = async(req, res, next, productToAdd) => {
    try {
        let alreadyInCart = false;
        const cartItems = req.body.Cart.products;
        cartItems.forEach(item => {
            if (item._id === productToAdd.id) {
                item++;
                alreadyInCart = true;
            }
            if (!alreadyInCart) {
                cartItems.push(...productToAdd)
            }
        });
    } catch (err) {
        next(err);
    }
}

module.exports.addProductQuantityInCart = async(req, res, next) => {

}

module.exports.removeProductQuantityInCart = async(req, res, next) => {

}

module.exports.getCartItems = async(req, res, next) => {
    const owner = req.userId;
    try {
        const cart = await Cart.findOne({ owner });
        if (cart && cart.products.length > 0) {
            res.json(cart);
        } else {
            res.json(null);
        }
    } catch (err) {
        next(err);
    }
}

module.exports.addCart = async(req, res, next) => {
    const userId = req.body.userId._id;
    const { productId, quantity } = req.body.products;

    try {
        const cart = await Cart.findOne({ userId });
        const product = await Product.findOne({ _id: productId });
        const price = product.price;
        const title = product.title;

        if (cart) {
            const productIndex = cart.products.findIndex((product) => product.productId == productId);
            // product exist?
            if (productIndex > -1) {
                let product = cart.products[productIndex];
                product.quantity += quantity;

                cart.total = cart.products.reduce((acc, curr) => {
                    return acc + curr.quantity * curr.price;
                }, 0)
                cart.products[productIndex] = product;
                await cart.save();
                res.status(200).send(cart);
            } else {
                cart.products.push({ productId, title, quantity, price });
                cart.total = cart.products.reduce((acc, curr) => {
                    return acc + curr.quantity * curr.price;
                }, 0)

                await cart.save();
                res.status(200).send(cart);
            }
        } else {
            //create a newCart
            const newCart = await Cart.create({
                userId,
                products: [{ productId, title, quantity, price }],
                total: quantity * price,
            });
            return res.status(201).send(newCart);
        }
    } catch (err) {
        next(err);
    }
}

module.exports.deleteCart = async(req, res, next) => {
    const owner = req.userId;
    const productQueryId = req.query.productId;

    try {
        let cart = await Cart.findOne({ owner });

        const productIndex = cart.products.findIndex((product) => product.productId == productQueryId);

        if (productIndex > -1) {
            let product = cart.products[productIndex];
            cart.total -= product.quantity * product.price;
            if (cart.total < 0) {
                cart.total = 0
            }
            cart.products.splice(productIndex, 1);
            cart.total = cart.products.reduce((acc, curr) => {
                return acc + curr.quantity * curr.price;
            }, 0)
            cart = await cart.save();
            res.status(200).send(cart);
        } else {
            res.status(404).send("product not found")
        }
    } catch (err) {
        next(err);
    }

}