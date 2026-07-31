const express = require('express');
const router = express.Router();
const { createPlan, getPlans, deletePlan } = require('../controllers/planController');
const { protect, authorize } = require('../middleware/authMiddleware');
const validate = require('../middleware/validationMiddleware');
const { planSchema } = require('../validators/planValidator');

// Read plans (accessible to all authenticated users for investment options)
router.get('/', protect, getPlans);

// Create plan (admin-only)
router.post('/', protect, authorize('admin'), validate(planSchema), createPlan);

// Delete or toggle plan status (admin-only)
router.delete('/:id', protect, authorize('admin'), deletePlan);

module.exports = router;
