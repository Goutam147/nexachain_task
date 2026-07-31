const referralService = require('../services/referralService');

/**
 * GET /api/referrals — Get referral income history for logged-in user
 */
const getReferralIncome = async (req, res) => {
  try {
    const referrals = await referralService.getReferralIncomeByUserId(req.user._id);
    res.json({
      status: 'success',
      referrals
    });
  } catch (error) {
    console.error('Error fetching referral income:', error.message);
    res.status(500).json({
      status: 'error',
      message: error.message || 'Failed to fetch referral income history'
    });
  }
};

/**
 * GET /api/referrals/tree — Get referral tree hierarchy for logged-in user
 */
const getReferralTree = async (req, res) => {
  try {
    const tree = await referralService.buildReferralTree(req.user._id);
    res.json({
      status: 'success',
      tree
    });
  } catch (error) {
    console.error('Error building referral tree:', error.message);
    res.status(500).json({
      status: 'error',
      message: error.message || 'Failed to build referral tree'
    });
  }
};

module.exports = {
  getReferralIncome,
  getReferralTree
};
