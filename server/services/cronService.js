const cron = require('node-cron');
const Investment = require('../models/Investment');
const RoiHistory = require('../models/RoiHistory');
const User = require('../models/User');
const { getKolkataTime, getKolkataStartAndEndOfToday } = require('../utils/dateHelper');

/**
 * Executes daily ROI calculations and payout distributions for all active investments.
 * Enforces strict idempotency checks to prevent double crediting.
 */
const processDailyRoi = async () => {
  console.log('[Cron Service] Starting Daily ROI processing...');
  
  // Find all active investment contracts
  const activeInvestments = await Investment.find({ status: 'Active' });
  console.log(`[Cron Service] Found ${activeInvestments.length} active contracts.`);

  // Calculate start and end bounds of today in IST local time
  const { start: startOfToday, end: endOfToday } = getKolkataStartAndEndOfToday();

  let successCount = 0;
  let skippedCount = 0;
  let errorCount = 0;
  const details = [];

  for (const investment of activeInvestments) {
    try {
      // 1. Idempotency Check: Verify if ROI has already been credited today
      const alreadyCredited = await RoiHistory.findOne({
        investment: investment._id,
        date: { $gte: startOfToday, $lte: endOfToday }
      });

      if (alreadyCredited) {
        skippedCount++;
        details.push({
          investmentId: investment._id,
          status: 'Skipped',
          reason: 'ROI already processed for today'
        });
        continue;
      }

      // 2. Fetch contract owner profile
      const user = await User.findById(investment.user);
      if (!user) {
        errorCount++;
        details.push({
          investmentId: investment._id,
          status: 'Failed',
          reason: 'User profile not found'
        });
        continue;
      }

      // 3. Compute ROI payout amount
      const roiAmount = investment.investmentAmount * (investment.dailyRoiPercentage / 100);

      // 4. Save ROI transaction history log
      const roiLog = new RoiHistory({
        user: user._id,
        investment: investment._id,
        amount: roiAmount,
        date: getKolkataTime(),
        status: 'Credited'
      });
      await roiLog.save();

      // 5. Update user's wallet metrics
      user.walletBalance += roiAmount;
      user.totalRoiEarned += roiAmount;
      await user.save();

      successCount++;
      details.push({
        investmentId: investment._id,
        userId: user._id,
        fullName: user.fullName,
        amount: roiAmount,
        status: 'Credited'
      });

    } catch (error) {
      errorCount++;
      console.error(`[Cron Service] Failed to process investment ID: ${investment._id}. Error:`, error.message);
      details.push({
        investmentId: investment._id,
        status: 'Failed',
        reason: error.message
      });
    }
  }

  console.log(`[Cron Service] Daily ROI execution finished. Successes: ${successCount}, Skipped: ${skippedCount}, Errors: ${errorCount}`);
  
  return {
    success: true,
    summary: {
      totalProcessed: activeInvestments.length,
      successCount,
      skippedCount,
      errorCount
    }
  };
};

/**
 * Initializes node-cron background task scheduler to run daily at 12:00 AM.
 */
const initCronScheduler = () => {
  // 12:00 AM everyday: '0 0 * * *'
  cron.schedule('0 0 * * *', async () => {
    try {
      await processDailyRoi();
    } catch (error) {
      console.error('[Cron Scheduler] Fatal error during daily cron execution:', error.message);
    }
  });
  console.log('[Cron Scheduler] Node-cron initialized and scheduled for 12:00 AM daily.');
};

module.exports = {
  processDailyRoi,
  initCronScheduler
};
