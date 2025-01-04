const express = require("express");
const router = express.Router();
const userController = require("../controllers/usersControllers");
const validateFields = require('../middleware/checkfield');
const verifyToken = require('../middleware/authcontroller');

// GET /users/profile route
router.post('/login', userController.loginUser);
router.get("/profile", verifyToken, userController.getProfile);
router.post('/register', validateFields(["email", "password"]), userController.saveUserData);


module.exports = router;