const express = require("express");
const router = express.Router();

//controllers
const {
  login,
  register,
  forgotPassword,
  resetPassword,
} = require("../controllers/authController");

router.post("/login", login);
router.post("/forgotPassword", forgotPassword);
router.post("/resetPassword", resetPassword);
router.post("/register", register);

module.exports = router;
