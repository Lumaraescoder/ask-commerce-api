const User = require("../models/user");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const SECRET_KEY = "SECRET_KEY";
const SERVER_ERROR = "Failed to log in. Please try again later.";

module.exports.login = async (req, res, next) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        message: "Missing username or password",
        status: "Error",
      });
    }

    const user = await User.findOne({ username });

    if (!user) {
      return res.status(401).json({
        status: "error",
        message: "Invalid username or password",
      });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (passwordMatch) {
      const token = jwt.sign({ user: user.username }, SECRET_KEY);
      return res.json({
        token,
      });
    } else {
      return res.status(401).json({
        status: "error",
        message: "Invalid username or password",
      });
    }
  } catch (err) {
    next(err);
  }
};

module.exports.register = async (req, res, next) => {
  const { username, email, password } = req.body;
  const saltRounds = 10;
  try {
    if (!username || !email || !password) {
      return res.status(400).json({
        message: "Missing username, email or password",
        status: "Error",
      });
    }

    const existingUser = await User.findOne({
      username: username,
      email: email,
    });
    if (existingUser) {
      return res.status(409).json({
        message: "User with the same username or email already exists",
        status: "Conflict",
      });
    }
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const user = await User.create({
      username: username,
      email: email,
      password: hashedPassword,
    });
    res.json(user);
  } catch (err) {
    next(err);
  }
};
