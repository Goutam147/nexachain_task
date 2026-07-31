const RoiHistory = require('../models/RoiHistory');

/**
 * Retrieves ROI payout history for a user, populating the investment details and the plan name.
 */
const getRoiHistoryByUserId = async (userId) => {
  return await RoiHistory.find({ user: userId })
    .populate({
      path: 'investment',
      select: 'planDetails investmentAmount dailyRoiPercentage',
      populate: {
        path: 'planDetails',
        select: 'planName'
      }
    })
    .sort({ date: -1 });
};

module.exports = {
  getRoiHistoryByUserId
};
