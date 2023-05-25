const User = require("../models/user");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

module.exports.login = async (req, res, next) => {
  try {
    const { username, password } = req.body;

    // Verificar se o utilizador existe na BD
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(404).json({
        status: "error",
        message: "User not found.",
      });
    }

    // Comparar a senha encriptada com a senha fornecida
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({
        status: "error",
        message: "Invalid password.",
      });
    }

    // Gerar um token com o ID
    const token = jwt.sign(
      { id: user._id, isAdmin: user.isAdmin },
      "SECRET_KEY",
      { expiresIn: "1h" }
    );

    console.log("Generated token:", token); // Exibir o token no console

    res.json({
      status: "success",
      message: "Login successful.",
      token,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "An unexpected error occurred.",
    });
  }
};

module.exports.register = async (req, res, next) => {
  const { username, email, password, firstName, lastName, isAdmin } = req.body;
  const saltRounds = 10;
  try {
    if (
      !username ||
      !email ||
      !password ||
      !firstName ||
      !lastName ||
      isAdmin === undefined
    ) {
      return res.status(400).json({
        message: "Missing fields!",
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
      firstName: firstName,
      lastName: lastName,
      isAdmin: isAdmin,
    });
    res.status(201).json({ message: "Sucessfully registered user!" });
  } catch (err) {
    next(err);
  }
};
