const cart = require('../models/cart');
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
    // module.exports.addCart = async(req, res) => {
    //     try {
    //         const { userId, products } = req.body;

//         let cart;

//         if (userId) {
//             cart = await Cart.findOne({ userId });
//         }

//         if (!cart) {
//             cart = new Cart({ userId, products: [], total: 0 });
//         }

//         for (const product of products) {
//             const { productId, title, quantity, price } = product;

//             if (!productId || !title) {
//                 continue;
//             }
//             cart.products.push({ productId, title, quantity, price });

//             cart.total += quantity * price;
//         }

//         await cart.save();

//         res.status(201).json({ message: 'Cart with product added successfully', cart });

//     } catch (err) {
//         console.log(err);
//         res.status(500).json({ message: "Failed to add cart with product", err });
//     }
// };

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
        //console.log("productIdOnBody ->", productToAdd);
        //console.log("quantityOfProductToAdd -> ", quantityOfProductToAdd);

        let isProductAlreadyInCart = await cart.products.find(product => product.productId === `${productToAdd}`);
        //console.log("isProductAlreadyInCart ? ->", isProductAlreadyInCart);

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
            // let productIndex = cart.products.indexOf(isProductAlreadyInCart);
            // console.log("productIndex -> ", productIndex);
            // console.log("cart.products[productIndex] ->", cart.products[productIndex]);
            isProductAlreadyInCart.quantity += quantityOfProductToAdd;
            cart.total += quantityOfProductToAdd * isProductAlreadyInCart.price;
            // cart.products[productIndex].quantity += req.body.products.quantity;
        }

        await cart.save();


        res.status(201).json({ message: 'Cart with product added successfully', cart });

    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Failed to add cart with product", err });
    }
};

module.exports.deleteCart = async(req, res) => {
    const userId = req.params.userId;
    const productParamId = req.params.productId;
    try {
        //const { userId, productId } = req.params;

        let cart;

        if (userId) {
            cart = await Cart.findOne({ userId });
        }

        if (!cart) {
            res.status(500).json({ message: "Failed to find cart for this user", err });
        }


        //for (const product of cart.products) {
        //const { productId, title, quantity, price } = product;

        if (!productParamId) {
            res.status(500).json({ message: "Failed to find product on this cart", err });
        }

        if (productParamId) {
            //console.log("cart.products ->", cart.products);
            let selectedProduct = await cart.products.find(product => product.productId === `${productParamId}`);
            if (selectedProduct === undefined) {
                res.status(500).json({ message: "Failed to find product on this cart", err });
            } else {

                //console.log("selectedProduct is this one->", selectedProduct);
                //console.log("selectedProduct.quantity is this one->", selectedProduct.quantity);

                if (selectedProduct.quantity > 1) {
                    //console.log('value bigger than 1');
                    //console.log("selectedProductQuantity is ->", selectedProduct.quantity)
                    selectedProduct.quantity -= 1;
                    cart.total -= selectedProduct.price;
                } else {
                    //console.log("value is equal to 1");
                    let indexOfSelectedProduct = cart.products.indexOf(selectedProduct);
                    //console.log("indexOfSelectedProduct", indexOfSelectedProduct);
                    cart.products.splice(indexOfSelectedProduct, 1);
                    cart.total -= selectedProduct.quantity * selectedProduct.price;
                }
                // for (const product of cart.products) {
                //     cart.total -= selectedProduct.quantity * selectedProduct.price;
                // }
                //console.log("updated cart", cart);
                //console.log("cart length is ->", cart.products.length);
            }
        }
        if (cart.products.length < 1) {
            const cart = await Cart.deleteOne({ userId: req.params.userId });
            //res.json(cart);
            res.status(200).json({ message: 'Product removed successfully from cart and cart deleted' });
        } else {
            await cart.save();
            res.status(200).json({ message: 'Product removed successfully from cart', cart });
        }

    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Failed to remove product from cart", err });
    }
}