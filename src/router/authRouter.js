const express = require("express");
const { signUp, signIn } = require("../controllers/authController");

const router = express.Router();

// def des routes (le prefixe /api/auth est defini dans server.js)
router.post("/signup", signUp);
router.post("/signin", signIn);

module.exports = router;
