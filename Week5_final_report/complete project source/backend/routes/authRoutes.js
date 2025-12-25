// AUTH ROUTES

const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { authenticateToken } = require('../middleware/auth');

router.post('/login', authController.login);
router.get('/me', authenticateToken, authController.getCurrentUser);
router.post('/register', authenticateToken, authController.register); // Admin only
router.put('/change-password', authenticateToken, authController.changePassword);

module.exports = router;