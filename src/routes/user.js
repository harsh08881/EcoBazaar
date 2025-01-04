const express = require("express");
const router = express.Router();
const userController = require("../controllers/usersControllers");

// GET /users/profile route
router.get("/profile", userController.getProfile);
router.post('/profile', userController.saveUserData);

module.exports = router;