const mongoose = require('mongoose');

const referralIncomeSchema = new mongoose.Schema({
  recipient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Recipient user reference is required'],
    index: true
  },
  generator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Generator user reference is required'],
    index: true
  },
  level: {
    type: Number,
    required: [true, 'Referral level is required'],
    min: [1, 'Referral level must be at least 1']
  },
  amount: {
    type: Number,
    required: [true, 'Income amount is required'],
    min: [0, 'Income amount cannot be negative']
  },
  date: {
    type: Date,
    required: true,
    default: Date.now,
    index: true
  }
}, {
  timestamps: true,
  versionKey: false
});

const ReferralIncome = mongoose.model('ReferralIncome', referralIncomeSchema);
module.exports = ReferralIncome;
