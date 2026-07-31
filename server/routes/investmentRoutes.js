const express = require('express');
const router = express.Router();
const investmentController = require('../controllers/investmentController');
const { protect } = require('../middleware/authMiddleware');
const validate = require('../middleware/validationMiddleware');
const { investmentSchema } = require('../validators/investmentValidator');

// Protect all investment routes
router.use(protect);

// GET /api/investments - fetch list of user's investments
// POST /api/investments - make a new investment contract
router.route('/')
  .get(investmentController.getInvestments)
  .post(validate(investmentSchema), investmentController.createInvestment);

module.exports = router;
