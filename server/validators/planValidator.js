const { z } = require('zod');

const planSchema = z.object({
  planName: z.string()
    .min(3, { message: 'Plan name must be at least 3 characters long' })
    .max(50, { message: 'Plan name cannot exceed 50 characters' })
    .trim(),
  roi: z.number({
    required_error: 'ROI percentage is required',
    invalid_type_error: 'ROI must be a number'
  }).min(0, { message: 'ROI cannot be negative' }).max(100, { message: 'ROI cannot exceed 100%' }),
  period: z.number({
    required_error: 'Period (days) is required',
    invalid_type_error: 'Period must be a number'
  }).int().min(1, { message: 'Period must be at least 1 day' }),
  minInvestAmount: z.number({
    required_error: 'Minimum investment amount is required',
    invalid_type_error: 'Minimum investment amount must be a number'
  }).min(0, { message: 'Minimum investment amount cannot be negative' }),
  levelBonus: z.array(z.number().min(0, { message: 'Bonus percentage cannot be negative' }).max(100, { message: 'Bonus cannot exceed 100%' }))
    .min(1, { message: 'At least one level bonus must be specified' }),
  status: z.enum(['Active', 'Inactive']).default('Active').optional()
});

module.exports = {
  planSchema
};
