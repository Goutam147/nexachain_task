const investmentService = require('../services/investmentService');

/**
 * Handles creation of a new investment contract
 */
const createInvestment = async (req, res) => {
  try {
    const { investmentAmount, planDetails } = req.body;
    const userId = req.user._id; // set by protect middleware

    const investment = await investmentService.createInvestment(userId, investmentAmount, planDetails);

    res.status(201).json({
      status: 'success',
      message: 'Investment contract created successfully',
      investment
    });
  } catch (err) {
    res.status(400).json({
      status: 'error',
      message: err.message || 'Failed to create investment'
    });
  }
};

/**
 * Handles listing history entries of investments
 */
const getInvestments = async (req, res) => {
  try {
    const userId = req.user._id;
    const investments = await investmentService.getInvestmentsByUserId(userId);

    res.status(200).json({
      status: 'success',
      investments
    });
  } catch (err) {
    res.status(500).json({
      status: 'error',
      message: err.message || 'Failed to fetch investment history'
    });
  }
};

module.exports = {
  createInvestment,
  getInvestments
};
