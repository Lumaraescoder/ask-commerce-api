const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const mongoose = require("mongoose");
require("dotenv").config();
const indexRouter = require("./routes/index");
const usersRouter = require("./routes/users");
const productsRouter = require("./routes/product");

const { handleErrors } = require("./middlewares/errorHandler");
const app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/products", productsRouter);
app.use("/categories", productsRouter);
app.use("/category", productsRouter);

app.use((req, res, next) => {
  // Set the "Access-Control-Allow-Origin" header to allow requests from any URL
  // Replace "*" with a specific URL to restrict access to only that URL
  res.header("Access-Control-Allow-Origin", "*");
  // Set the "Access-Control-Allow-Methods" header to specify the allowed HTTP methods
  res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE");
  // Enable the CORS middleware to handle CORS headers automatically
  app.use(cors());
  // Pass control to the next middleware function
  next();
});

app.use(handleErrors);
app.use(function (req, res, next) {
  next(createError(404));
});

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
app.use(function (err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
