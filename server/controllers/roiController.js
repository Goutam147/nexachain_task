const roiService = require('../services/roiService');

/**
 * GET /api/roi — Get ROI history for logged-in user
 */
const getRoiHistory = async (req, res) => {
  try {
    const history = await roiService.getRoiHistoryByUserId(req.user._id);
    res.json({
      status: 'success',
      history
    });
  } catch (error) {
    console.error('Error fetching ROI history:', error.message);
    res.status(500).json({
      status: 'error',
      message: error.message || 'Failed to fetch ROI payout history'
    });
  }
};

module.exports = {
  getRoiHistory
};
