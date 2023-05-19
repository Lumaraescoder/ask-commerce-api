const User = require("../models/user");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const salt = 10;

module.exports.login = async (req, res) => {
  try {
    let username = req.body.username;
    let password = req.body.password;

    if (bcrypt.compare(username, password)) {
      const user = await User.findOne({
        username: username,
        password: password,
      });
      res.json({
        token: jwt.sign({ user: user.username }, "secret_key"),
      });
    } else {
      return res.status(401).json({
        status: "error",
        message: "Invalid username or password.",
      });
    }
  } catch {
    res.status(500).json({ message: "Fail to get user!" });
  }
};

module.exports.register = async (req, res) => {
  // let username = req.body.username;
  // let email = req.body.email;
  // let password = req.body.password;
  // hashedPassword = bcrypt.hash(password, salt);
  // try {
  //   const user = await User.create({
  //     username: username,
  //     email: email,
  //     password: hashedPassword,
  //   });
  //   res.json(user);
  // } catch {
  //   res.status(500).json({ message: "Fail to register user!" });
  // }
};
