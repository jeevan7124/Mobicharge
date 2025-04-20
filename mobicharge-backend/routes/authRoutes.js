const express = require('express');
const { register, login } = require('../controllers/authController');
const router = express.Router();
const { googleLogin } = require("../controllers/authController");


router.post('/register', register);
router.post('/login', login);
// Google Sign-In Route
router.post("/google-login", googleLogin);
module.exports = router;
