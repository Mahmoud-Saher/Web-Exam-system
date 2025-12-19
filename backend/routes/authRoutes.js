// backend/routes/authRoutes.js

const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// تعريف الروابط
// POST: http://localhost:3001/api/auth/signup
router.post('/signup', authController.register);

// POST: http://localhost:3001/api/auth/login
router.post('/login', authController.login);

module.exports = router;


























































