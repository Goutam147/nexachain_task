const express = require('express');
const router = express.Router();
const cronController = require('../controllers/cronController');

// GET /api/cron/trigger?secret=<CRON_SECRET> — Trigger daily ROI distribution
router.get('/trigger', cronController.triggerDailyRoi);

module.exports = router;
