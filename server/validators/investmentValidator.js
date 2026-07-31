const { z } = require('zod');

// Investment validator schema
const investmentSchema = z.object({
  investmentAmount: z.number({
    required_error: 'Investment amount is required',
    invalid_type_error: 'Investment amount must be a number'
  })
  .positive({ message: 'Investment amount must be greater than zero' }),
  planDetails: z.string({
    required_error: 'Plan details are required'
  })
  .min(3, { message: 'Plan details must be at least 3 characters long' })
  .trim()
});

module.exports = {
  investmentSchema
};
