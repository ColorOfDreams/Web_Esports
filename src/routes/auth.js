// src/routes/auth.js
const express = require('express')
const router = express.Router()
const AuthController = require('../app/controllers/authController')

// GET: Hiển thị form
router.get('/login', AuthController.loginForm)
router.get('/register', AuthController.registerForm)

// POST: Xử lý form
router.post('/login', AuthController.loginLogic)
router.post('/register', AuthController.registerLogic)

module.exports = router;
