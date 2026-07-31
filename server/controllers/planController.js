const planService = require('../services/planService');

// @desc    Create a new investment plan
// @route   POST /api/plans
// @access  Private (Admin Only)
const createPlan = async (req, res) => {
  try {
    const result = await planService.createPlan(req.body);
    res.status(201).json({
      status: 'success',
      plan: result
    });
  } catch (error) {
    res.status(400).json({ status: 'fail', message: error.message });
  }
};

// @desc    Get all investment plans
// @route   GET /api/plans
// @access  Private
const getPlans = async (req, res) => {
  try {
    const result = await planService.getPlans();
    res.json({
      status: 'success',
      plans: result
    });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

// @desc    Delete or toggle plan status
// @route   DELETE /api/plans/:id
// @access  Private (Admin Only)
const deletePlan = async (req, res) => {
  try {
    const result = await planService.deletePlan(req.params.id);
    res.json({
      status: 'success',
      ...result
    });
  } catch (error) {
    res.status(400).json({ status: 'fail', message: error.message });
  }
};

module.exports = {
  createPlan,
  getPlans,
  deletePlan
};
