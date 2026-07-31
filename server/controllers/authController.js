const authService = require('../services/authService');

// @desc    Register new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
  try {
    // Body is already validated and formatted by validationMiddleware
    const result = await authService.registerUser(req.body);
    res.status(201).json({
      status: 'success',
      token: result.token,
      user: result.user
    });
  } catch (error) {
    res.status(400).json({ status: 'fail', message: error.message });
  }
};

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
  try {
    // Body is already validated and formatted by validationMiddleware
    const result = await authService.loginUser(req.body);
    res.json({
      status: 'success',
      token: result.token,
      user: result.user
    });
  } catch (error) {
    res.status(401).json({ status: 'fail', message: error.message });
  }
};

// @desc    Get current user profile
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res) => {
  try {
    const user = await authService.getUserProfile(req.user._id);
    res.json({
      status: 'success',
      user
    });
  } catch (error) {
    res.status(404).json({ status: 'fail', message: error.message });
  }
};

// @desc    Get all users list
// @route   GET /api/auth/users
// @access  Private (Admin Only)
const getAllUsers = async (req, res) => {
  try {
    const users = await authService.getAllUsers();
    res.json({
      status: 'success',
      users
    });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

module.exports = {
  registerUser,
  loginUser,
  getMe,
  getAllUsers
};
