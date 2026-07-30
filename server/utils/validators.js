const { z } = require('zod');

// Registration validator schema
const registerSchema = z.object({
  fullName: z.string()
    .min(2, { message: 'Full name must be at least 2 characters long' })
    .max(50, { message: 'Full name cannot exceed 50 characters' })
    .trim(),
  email: z.string()
    .email({ message: 'Invalid email address' })
    .trim(),
  mobileNumber: z.string()
    .min(10, { message: 'Mobile number must be at least 10 digits' })
    .max(15, { message: 'Mobile number cannot exceed 15 digits' })
    .trim(),
  password: z.string()
    .min(6, { message: 'Password must be at least 6 characters long' })
    .max(100, { message: 'Password cannot exceed 100 characters' }),
  referralCode: z.string()
    .trim()
    .optional()
    .or(z.literal('')) // Allow empty string
});

// Login validator schema
const loginSchema = z.object({
  email: z.string()
    .email({ message: 'Invalid email address' })
    .trim(),
  password: z.string()
    .min(1, { message: 'Password is required' })
});

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
  registerSchema,
  loginSchema,
  investmentSchema
};
