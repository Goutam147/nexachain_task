const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const roiController = require('../controllers/roiController');

// Protect all ROI routes
router.use(protect);

// GET /api/roi — Get ROI history (authenticated)
router.get('/', roiController.getRoiHistory);

module.exports = router;
