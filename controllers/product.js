const Product = require("../models/product");
const multer = require("multer");
const upload = multer().single("image");
const cloudinary = require("cloudinary").v2;

module.exports.getAllProducts = async(req, res, next) => {
    try {
        let limit = Number(req.query.limit);
        let sort = req.query.sort == "desc" ? -1 : 1;

        const products = await Product.find()
            //.select("-image")
            .limit(limit)
            .sort({ id: sort });

        res.json(products);
    } catch (err) {
        next(err);
    }
};

module.exports.getProductCategories = async(req, res) => {
    try {
        const categories = await Product.distinct("category");
        res.json(categories);
    } catch (error) {
        res
            .status(500)
            .json({ message: "Failed to fetch product categories!", error: error });
    }
};

module.exports.getProduct = async(req, res) => {
    try {
        let id = req.params.id;
        const product = await Product.findById(id).select();

        if (!product) {
            res.status(404).json({ message: "Fail to get product!" });
        } else {
            res.json(product);
        }
    } catch {
        res.status(500).json({ message: "Fail to fetch product!" });
    }
};

module.exports.getProductsInCategory = async(req, res, next) => {
    try {
        let category = req.params.category;

        const products = await Product.find({ category });
        const modifiedProducts = products.map((product) => {
            const hasImage =
                product.image && product.image.data && product.image.data.length > 0 ?
                "yes" :
                "no";
            const modifiedProduct = {...product._doc, image: hasImage };
            return modifiedProduct;
        });

        res.json(modifiedProducts);
    } catch (error) {
        res
            .status(500)
            .json({ message: "Failed to fetch products!", error: error });
    }
};

module.exports.addProduct = async(req, res, next) => {
    try {
        const { title, price, description, category, rating } = req.body;
        const { rate, count } = rating;

        if (!title || !price || !description || !category) {
            return res.status(400).json({
                status: "error",
                message: "Provide all required fields.",
            });
        }

        const product = await Product.create({
            title,
            price,
            description,
            category,
            rating: {
                rate,
                count,
            }
        });

        // const responseProduct = {
        //     title: product.title,
        //     price: product.price,
        //     description: product.description,
        //     category: product.category,
        //     rating: {
        //         rate,
        //         count,
        //     }
        // };

        res.json(product);
    } catch (err) {
        next(err);
    }
};

module.exports.editProduct = async(req, res, next) => {
    try {
        if (!req.body || !req.params.id) {
            return res.status(400).json({
                status: "error",
                message: "Provide product to edit.",
            });
        }

        const { title, price, description, category } = req.body;

        const updates = {};

        if (title || price || description || category) {
            // $set is a MongoDB update operator that specifies which fields should be updated in a document.
            updates.$set = {};
            if (title) updates.$set.title = title;
            if (price) updates.$set.price = price;
            if (description) updates.$set.description = description;
            if (category) updates.$set.category = category;
        } else {
            return res.json("No fields to update!");
        }

        const product = await Product.findByIdAndUpdate(req.params.id, updates, {
            new: true,
        });

        return res.json("Product updated!");
    } catch (err) {
        next(err);
    }
};

module.exports.deleteProduct = async(req, res, next) => {
    try {
        if (req.params.id == null) {
            return res.status(400).json({
                status: "error",
                message: "Provide id",
            });
        } else {
            const product = await Product.deleteOne({ _id: req.params.id });
            res.json(product);
        }
    } catch (err) {
        next(err);
    }
};

module.exports.createProduct = async(req, res, next) => {
    try {
        const result = await cloudinary.uploader.upload(req.file.path);
        const product = new Product({
            title: req.body.title,
            price: req.body.price,
            category: req.body.category,
            description: req.body.description,
            image: result.secure_url,
            rating: {
                rate: req.body.rating.rate,
                count: req.body.rating.count,
            }
        });
        await product.save();
        res.send({
            success: true,
            product: product,
        })
    } catch (err) {
        console.log(err);
        res.send({
            success: false,
            message: err.message,
        })
    }
}