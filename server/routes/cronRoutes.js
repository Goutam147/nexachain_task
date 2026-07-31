const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const cronController = require('../controllers/cronController');

// Protect all cron trigger routes
router.use(protect);

// POST /api/cron/trigger — Manually trigger ROI scheduler calculations (Admin only)
router.post('/trigger', cronController.triggerDailyRoi);

module.exports = router;
