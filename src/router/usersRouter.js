const express = require("express");
const { getAllUsers, getUserById, createUser, updateUser, deleteUser } = require("../controllers/usersController");

const router = express.Router();

// def des routes (le prefixe /api/users est defini dans server.js)
router.get("/", getAllUsers);
router.get("/:id", getUserById);
router.post("/", createUser);
router.put("/:id", updateUser);
router.delete("/:id", deleteUser);

module.exports = router;
