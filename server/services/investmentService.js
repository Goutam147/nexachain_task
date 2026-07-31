const Investment = require('../models/Investment');
const Plan = require('../models/Plan');
const User = require('../models/User');
const ReferralIncome = require('../models/ReferralIncome');
const { getKolkataTime } = require('../utils/dateHelper');

/**
 * Creates a new user investment contract, deducts user wallet balance,
 * and recursively distributes multilevel referral commissions.
 */
const createInvestment = async (userId, investmentAmount, planId) => {
  // 1. Fetch Plan details
  const plan = await Plan.findById(planId);
  if (!plan) {
    throw new Error('Investment plan not found');
  }
  if (plan.status !== 'Active') {
    throw new Error('This investment plan is currently Inactive');
  }

  // 2. Validate investment amount
  if (investmentAmount < plan.minInvestAmount) {
    throw new Error(`Investment amount must be at least ₹${plan.minInvestAmount}`);
  }

  // 3. Fetch User
  const user = await User.findById(userId);
  if (!user) {
    throw new Error('User account not found');
  }

  // 4. Create investment contract
  const startDate = getKolkataTime();
  const endDate = new Date(startDate.getTime() + plan.period * 24 * 60 * 60 * 1000);

  const investment = new Investment({
    user: userId,
    investmentAmount,
    planDetails: planId,
    startDate,
    endDate,
    dailyRoiPercentage: plan.roi,
    status: 'Active'
  });

  await investment.save();

  // 6. Multilevel Referral Commissions Distribution
  // Loop up the referral tree recursively
  let currentReferrerId = user.referredBy;
  const levels = plan.levelBonus || []; // Numeric array: e.g. [10, 5, 2]

  for (let i = 0; i < levels.length; i++) {
    if (!currentReferrerId) {
      break; // No parent referrer at this level
    }

    const parent = await User.findById(currentReferrerId);
    if (!parent) {
      break; // Parent user not found, stop traversal
    }

    // Skip if parent account is suspended
    if (parent.accountStatus === 'Suspended') {
      currentReferrerId = parent.referredBy; // traverse up without paying
      continue;
    }

    // Calculate level commission payout
    const commissionPercent = levels[i];
    if (commissionPercent > 0) {
      const bonusAmount = investmentAmount * (commissionPercent / 100);

      // Credit parent referrer's balance
      parent.walletBalance += bonusAmount;
      parent.totalLevelIncomeEarned += bonusAmount;
      await parent.save();

      // Create ReferralIncome ledger entry
      const referralIncome = new ReferralIncome({
        recipient: parent._id,
        generator: user._id,
        level: i + 1,
        amount: bonusAmount,
        date: getKolkataTime()
      });
      await referralIncome.save();
    }

    // Move to next parent referrer level
    currentReferrerId = parent.referredBy;
  }

  return investment;
};

/**
 * Retrieves investment history list for a user.
 */
const getInvestmentsByUserId = async (userId) => {
  return await Investment.find({ user: userId })
    .populate('planDetails')
    .sort({ createdAt: -1 });
};

module.exports = {
  createInvestment,
  getInvestmentsByUserId
};
