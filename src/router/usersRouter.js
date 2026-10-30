const express = require("express");
const { getAllUsers, getUserById, createUser } = require("../controllers/usersController");

const router = express.Router();

// def des routes (le prefixe /api/users est defini dans server.js)
router.get("/", getAllUsers);
router.get("/:id", getUserById);
router.post("/", createUser);

module.exports = router;
