const express = require("express");
const router = express.Router();
const userController = require("../controllers/usersControllers");

// GET /users/profile route
router.get("/profile", userController.getProfile);

module.exports = router;