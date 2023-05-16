// import body from "express-validator";
// import validationResult from "express-validator";
let bodyi = require("express-validator");
let validationResults = require("express-validator");

exports.productValidation = [
  bodyi
    .body("title")
    .notEmpty()
    .withMessage("Title is required")
    .isString()
    .withMessage("Title should be a string"),
  bodyi
    .body("price")
    .notEmpty()
    .withMessage("Price is required")
    .isNumeric()
    .withMessage("Price should be a number"),
  bodyi
    .body("description")
    .notEmpty()
    .withMessage("Description is required")
    .isString()
    .withMessage("Description should be a string"),
  bodyi
    .body("image")
    .notEmpty()
    .withMessage("Image is required")
    .isString()
    .withMessage("Image should be a string"),
  bodyi
    .body("category")
    .notEmpty()
    .withMessage("Category is required")
    .isString()
    .withMessage("Category should be a string"),
];

exports.validate = (req, res, next) => {
  const errors = validationResults.valivalidationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  next();
};
