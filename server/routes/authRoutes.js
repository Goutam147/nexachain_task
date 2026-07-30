const express = require('express');
const router = express.Router();
const { 
  registerUser, 
  loginUser, 
  getMe, 
  getAllUsers 
} = require('../controllers/authController');
const { protect, authorize } = require('../middleware/authMiddleware');

// Public routes
router.post('/register', registerUser);
router.post('/login', loginUser);

// Private routes
router.get('/me', protect, getMe);

// Admin-only routes
router.get('/users', protect, authorize('admin'), getAllUsers);

module.exports = router;
