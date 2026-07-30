const mongoose = require('mongoose');

const investmentSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User reference is required'],
    index: true
  },
  investmentAmount: {
    type: Number,
    required: [true, 'Investment amount is required'],
    min: [0.01, 'Investment must be greater than 0']
  },
  planDetails: {
    type: String,
    required: [true, 'Plan details are required'],
    trim: true
  },
  startDate: {
    type: Date,
    required: true,
    default: Date.now
  },
  endDate: {
    type: Date,
    required: [true, 'End date is required']
  },
  dailyRoiPercentage: {
    type: Number,
    required: true,
    default: 1.0, // default 1% daily
    min: [0, 'Daily ROI percentage cannot be negative']
  },
  status: {
    type: String,
    enum: ['Active', 'Completed', 'Cancelled'],
    default: 'Active',
    index: true
  }
}, {
  timestamps: true,
  versionKey: false
});

const Investment = mongoose.model('Investment', investmentSchema);
module.exports = Investment;
