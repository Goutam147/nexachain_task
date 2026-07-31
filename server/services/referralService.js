const ReferralIncome = require('../models/ReferralIncome');
const User = require('../models/User');

/**
 * Retrieves referral income history for a user (as recipient).
 */
const getReferralIncomeByUserId = async (userId) => {
  return await ReferralIncome.find({ recipient: userId })
    .populate('generator', 'fullName email')
    .sort({ createdAt: -1 });
};

/**
 * Builds a recursive referral tree for a user up to a specified max depth.
 */
const buildReferralTree = async (userId) => {
  const getChildren = async (parentId) => {
    const children = await User.find({ referredBy: parentId })
      .select('fullName email referralCode walletBalance accountStatus');
    
    const childNodes = [];
    for (const child of children) {
      const grandchildren = await getChildren(child._id);
      childNodes.push({
        _id: child._id,
        fullName: child.fullName,
        email: child.email,
        referralCode: child.referralCode,
        walletBalance: child.walletBalance,
        accountStatus: child.accountStatus,
        children: grandchildren
      });
    }
    return childNodes;
  };

  const rootUser = await User.findById(userId)
    .select('fullName email referralCode walletBalance accountStatus');
  if (!rootUser) return null;

  return {
    _id: rootUser._id,
    fullName: rootUser.fullName,
    email: rootUser.email,
    referralCode: rootUser.referralCode,
    walletBalance: rootUser.walletBalance,
    accountStatus: rootUser.accountStatus,
    children: await getChildren(rootUser._id)
  };
};

module.exports = {
  getReferralIncomeByUserId,
  buildReferralTree
};
