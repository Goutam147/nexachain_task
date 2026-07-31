const User = require('../models/User');
const Investment = require('../models/Investment');
const ReferralIncome = require('../models/ReferralIncome');
const RoiHistory = require('../models/RoiHistory');
const Plan = require('../models/Plan');
const { getKolkataTime } = require('../utils/dateHelper');

/**
 * Computes live user stats and a 15-day Credit/Debit timeline for dashboard charts.
 */
const getUserDashboardData = async (userId) => {
  // 1. Fetch User profile
  const user = await User.findById(userId);
  if (!user) {
    throw new Error('User not found');
  }

  // 2. Active investments sum and count
  const activeInvestments = await Investment.find({ user: userId, status: 'Active' });
  const totalInvestments = activeInvestments.reduce((sum, inv) => sum + inv.investmentAmount, 0);
  const activeContracts = activeInvestments.length;

  // 3. Total ROI earned
  const roiRecords = await RoiHistory.find({ user: userId, status: 'Credited' });
  const roiEarned = roiRecords.reduce((sum, rec) => sum + rec.amount, 0);

  // 4. Total Level Income earned
  const refRecords = await ReferralIncome.find({ recipient: userId });
  const levelIncome = refRecords.reduce((sum, rec) => sum + rec.amount, 0);

  // 5. Generate 15-day timeline chart data
  const chartData = [];
  const todayKolkata = getKolkataTime();

  for (let i = 14; i >= 0; i--) {
    // Subtract days from the current Kolkata time
    const d = new Date(todayKolkata);
    d.setUTCDate(todayKolkata.getUTCDate() - i);

    const year = d.getUTCFullYear();
    const month = String(d.getUTCMonth() + 1).padStart(2, '0');
    const day = String(d.getUTCDate()).padStart(2, '0');
    const dateStr = `${year}-${month}-${day}`;

    const startOfDay = new Date(`${dateStr}T00:00:00.000Z`);
    const endOfDay = new Date(`${dateStr}T23:59:59.999Z`);

    // Sum Credits on this day (Referral Income + ROI Payouts)
    const dayReferrals = await ReferralIncome.find({
      recipient: userId,
      date: { $gte: startOfDay, $lte: endOfDay }
    });
    const dayRoi = await RoiHistory.find({
      user: userId,
      status: 'Credited',
      date: { $gte: startOfDay, $lte: endOfDay }
    });

    const dayCredit = dayReferrals.reduce((sum, r) => sum + r.amount, 0) +
                       dayRoi.reduce((sum, r) => sum + r.amount, 0);

    // Sum Debits on this day (Investment contract creation amount)
    const dayInvestments = await Investment.find({
      user: userId,
      startDate: { $gte: startOfDay, $lte: endOfDay }
    });
    const dayDebit = dayInvestments.reduce((sum, r) => sum + r.investmentAmount, 0);

    // Format date string for the chart, e.g. "Aug 01"
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const formattedDate = `${months[d.getUTCMonth()]} ${day}`;

    chartData.push({
      date: formattedDate,
      credit: dayCredit,
      debit: dayDebit
    });
  }

  return {
    stats: {
      totalInvestments,
      activeContracts,
      walletBalance: user.walletBalance,
      roiEarned,
      levelIncome
    },
    chartData
  };
};

/**
 * Computes live administrative metrics and system-wide daily investment chart data.
 */
const getAdminDashboardData = async () => {
  // 1. User counters
  const totalUsers = await User.countDocuments({ role: 'user' });
  const activeUsers = await User.countDocuments({ role: 'user', accountStatus: 'Active' });
  const suspendedUsers = await User.countDocuments({ role: 'user', accountStatus: 'Suspended' });

  // 2. Platform total investments volume
  const allInvestments = await Investment.find({ status: 'Active' });
  const totalVolume = allInvestments.reduce((sum, inv) => sum + inv.investmentAmount, 0);

  // 3. Active plans count
  const activePlansCount = await Plan.countDocuments({ status: 'Active' });

  // 4. Generate 15-day system-wide investment chart data
  const chartData = [];
  const todayKolkata = getKolkataTime();

  for (let i = 14; i >= 0; i--) {
    // Subtract days from the current Kolkata time
    const d = new Date(todayKolkata);
    d.setUTCDate(todayKolkata.getUTCDate() - i);

    const year = d.getUTCFullYear();
    const month = String(d.getUTCMonth() + 1).padStart(2, '0');
    const day = String(d.getUTCDate()).padStart(2, '0');
    const dateStr = `${year}-${month}-${day}`;

    const startOfDay = new Date(`${dateStr}T00:00:00.000Z`);
    const endOfDay = new Date(`${dateStr}T23:59:59.999Z`);

    // Sum global investments made on this day
    const dayInvestments = await Investment.find({
      startDate: { $gte: startOfDay, $lte: endOfDay }
    });
    const amount = dayInvestments.reduce((sum, r) => sum + r.investmentAmount, 0);

    // Format date string for the chart, e.g. "Aug 01"
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const formattedDate = `${months[d.getUTCMonth()]} ${day}`;

    chartData.push({
      date: formattedDate,
      amount
    });
  }

  return {
    stats: {
      totalUsers,
      activeUsers,
      suspendedUsers,
      totalVolume,
      activePlansCount
    },
    chartData
  };
};

module.exports = {
  getUserDashboardData,
  getAdminDashboardData
};
