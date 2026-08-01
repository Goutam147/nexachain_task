const cronService = require('../services/cronService');

const CRON_SECRET = process.env.CRON_SECRET || 'nc-inv-cron-2026';

/**
 * GET /api/cron/trigger?secret=<CRON_SECRET> — Trigger daily ROI distribution
 */
const triggerDailyRoi = async (req, res) => {
  try {
    if (req.query.secret !== CRON_SECRET) {
      return res.status(401).json({
        status: 'error',
        message: 'Unauthorized: Invalid cron secret key'
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
