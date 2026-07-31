const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const dashboardController = require('../controllers/dashboardController');

// GET /api/dashboard — Fetch user dashboard stats (authenticated)
router.get('/', protect, dashboardController.getDashboardData);

// GET /api/dashboard/admin — Fetch admin dashboard stats (authenticated/admin only)
router.get('/admin', protect, dashboardController.getAdminDashboard);

module.exports = router;
