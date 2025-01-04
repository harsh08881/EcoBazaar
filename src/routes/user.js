const express = require("express");
const router = express.Router();
const userController = require("../controllers/usersControllers");

// GET /users/profile route
router.post('/login', userController.loginUser);
router.get("/profile", userController.getProfile);
router.post('/register', userController.saveUserData);


module.exports = router;