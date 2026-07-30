const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'nexachainsecretjwtkey123456', {
    expiresIn: '30d'
  });
};

const registerUser = async ({ fullName, email, mobileNumber, password, referralCode }) => {
  const emailExists = await User.findOne({ email });
  if (emailExists) {
    throw new Error('Email address already registered');
  }

  let referredBy = null;
  if (referralCode) {
    const parentUser = await User.findOne({ referralCode: referralCode.toUpperCase() });
    if (!parentUser) {
      throw new Error('Invalid referral code');
    }
    referredBy = parentUser._id;
  }

  const user = new User({
    fullName,
    email,
    mobileNumber,
    password,
    referredBy
  });

  await user.save();

  return {
    token: generateToken(user._id),
    user: {
      id: user._id,
      fullName: user.fullName,
      email: user.email,
      mobileNumber: user.mobileNumber,
      referralCode: user.referralCode,
      role: user.role,
      walletBalance: user.walletBalance
    }
  };
};

const loginUser = async ({ email, password }) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw new Error('Invalid email or password');
  }

  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    throw new Error('Invalid email or password');
  }

  if (user.accountStatus !== 'Active') {
    throw new Error(`Account is ${user.accountStatus}`);
  }

  return {
    token: generateToken(user._id),
    user: {
      id: user._id,
      fullName: user.fullName,
      email: user.email,
      mobileNumber: user.mobileNumber,
      referralCode: user.referralCode,
      role: user.role,
      walletBalance: user.walletBalance
    }
  };
};

const getUserProfile = async (userId) => {
  const user = await User.findById(userId).select('-password');
  if (!user) {
    throw new Error('User not found');
  }
  return user;
};

const getAllUsers = async () => {
  return User.find({}).select('-password').sort('-createdAt');
};

module.exports = {
  registerUser,
  loginUser,
  getUserProfile,
  getAllUsers
};
