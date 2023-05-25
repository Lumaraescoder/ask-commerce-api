const jwt = require("jsonwebtoken");
const User = require("../models/user");

module.exports.adminValidator = async (req, res, next) => {
  try {
    // Token do cabeçalho da requisição
    const token = req.headers.authorization.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        status: "error",
        message: "Access denied. Token not provided.",
      });
    }

    // Verificar o token
    const decoded = jwt.decode(token, "SECRET_KEY");

    // Verificar o utilizador
    const user = await User.findById(decoded.id);
    console.log("Decoded ID", decoded.id);
    console.log("User", user);

    if (!user) {
      return res.status(401).json({
        status: "error",
        message: "Invalid token. User not found.",
      });
    }

    // Verificar isAdmin
    if (!user.isAdmin) {
      return res.status(403).json({
        status: "error",
        message: "Access denied. Only administrators can perform this action.",
      });
    }

    // Token verificado e isAdmin true
    // Passar para o próximo middle
    req.user = user;
    next();
  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: "error",
      message: "An unexpected error occurred.",
    });
  }
};
