const cronService = require('../services/cronService');

/**
 * POST /api/cron/trigger — Manually trigger the daily ROI calculation process (Admin only)
 */
const triggerDailyRoi = async (req, res) => {
  try {
    // Safety role guard check
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        status: 'error',
        message: 'Access denied: Administrative privileges required'
      });
    }

    const report = await cronService.processDailyRoi();
    res.json({
      status: 'success',
      message: 'Daily ROI distribution finished successfully',
      report
    });

  } catch (error) {
    console.error('Error triggering daily ROI cron:', error.message);
    res.status(500).json({
      status: 'error',
      message: error.message || 'Failed to complete daily ROI distribution'
    });
  }
};

module.exports = {
  triggerDailyRoi
};
