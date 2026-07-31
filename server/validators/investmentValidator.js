const { z } = require('zod');

// Investment validator schema
const investmentSchema = z.object({
  investmentAmount: z.number({
    required_error: 'Investment amount is required',
    invalid_type_error: 'Investment amount must be a number'
  })
  .positive({ message: 'Investment amount must be greater than zero' }),
  
  planDetails: z.string({
    required_error: 'Plan details reference is required'
  })
  .length(24, { message: 'Plan details must be a valid 24-character ObjectId' })
  .trim()
});

module.exports = {
  investmentSchema
};
