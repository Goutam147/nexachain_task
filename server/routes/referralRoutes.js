const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const referralController = require('../controllers/referralController');

// Protect all referral routes
router.use(protect);

// GET /api/referrals — Get referral income history (authenticated)
router.get('/', referralController.getReferralIncome);

// GET /api/referrals/direct — Get direct referrals (authenticated)
router.get('/direct', referralController.getDirectReferrals);

// GET /api/referrals/tree — Get referral tree structure (authenticated)
router.get('/tree', referralController.getReferralTree);

module.exports = router;
