const express = require("express");
const router = express.Router();
const userController = require("../controllers/usersControllers");
const validateFields = require('../middleware/checkfield');
const verifyToken = require('../middleware/authcontroller');
const menuController = require('../controllers/menuController')

// GET /users/profile route
router.post('/login', userController.loginUser);
router.get("/profile", verifyToken, userController.getProfile);
router.post('/register', validateFields(["email", "password"]), userController.saveUserData);
router.post('/device', verifyToken, userController.addDevice);
router.get('/menu', verifyToken, menuController.getItem);
router.get('/profile', verifyToken, userController.getUserData);


module.exports = router;