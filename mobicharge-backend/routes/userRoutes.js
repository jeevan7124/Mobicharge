const express = require('express');
const {
  getUserProfile,
  updateUserProfile
} = require('../controllers/userController');
const { authenticateToken } = require('../middleware/authMiddleware');

const router = express.Router();

// Routes
router.get('/profile', authenticateToken, getUserProfile);
router.put('/profile', authenticateToken, updateUserProfile); // 🔧 NEW

module.exports = router;
