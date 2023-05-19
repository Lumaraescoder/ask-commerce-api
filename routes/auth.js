const express = require("express");
const router = express.Router();
const auth = require("../controllers/auth");

router.get("/login", auth.login);
router.post("/register", auth.register);

module.exports = router;
