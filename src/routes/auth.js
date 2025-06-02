const express = require('express');
const router = express.Router();
const AuthController = require('../app/controllers/authController');

// GET form
router.get('/login', AuthController.loginForm);
router.get('/register', AuthController.registerForm);

// POST xử lý
router.post('/login', AuthController.login);
router.post('/register', AuthController.register);

module.exports = router;