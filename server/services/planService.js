const Plan = require('../models/Plan');
const Investment = require('../models/Investment');

const createPlan = async (planData) => {
  const existing = await Plan.findOne({ planName: planData.planName });
  if (existing) {
    throw new Error('A plan with this name already exists');
  }
  const plan = new Plan(planData);
  await plan.save();
  return plan;
};

const getPlans = async () => {
  return Plan.find({}).sort('-createdAt');
};

const deletePlan = async (planId) => {
  const plan = await Plan.findById(planId);
  if (!plan) {
    throw new Error('Plan not found');
  }

  // Check if this plan is referenced in any investments
  const count = await Investment.countDocuments({ planDetails: planId });
  if (count > 0) {
    // Plan is in use!
    if (plan.status === 'Active') {
      plan.status = 'Inactive';
      await plan.save();
      return {
        action: 'status_changed',
        message: 'Plan is in use by investments. Status changed to Inactive.',
        plan
      };
    } else {
      plan.status = 'Active';
      await plan.save();
      return {
        action: 'status_changed',
        message: 'Plan is in use by investments. Status changed to Active.',
        plan
      };
    }
  } else {
    // Plan is not in use! Delete it.
    await Plan.findByIdAndDelete(planId);
    return {
      action: 'deleted',
      message: 'Plan was successfully deleted.',
      planId
    };
  }
};

module.exports = {
  createPlan,
  getPlans,
  deletePlan
};
