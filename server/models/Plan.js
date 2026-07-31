const mongoose = require('mongoose');

const planSchema = new mongoose.Schema({
  planName: {
    type: String,
    required: [true, 'Plan name is required'],
    unique: true,
    trim: true
  },
  roi: {
    type: Number,
    required: [true, 'ROI percentage is required'],
    min: [0, 'ROI cannot be negative']
  },
  period: {
    type: Number,
    required: [true, 'Period (days) is required'],
    min: [1, 'Period must be at least 1 day']
  },
  minInvestAmount: {
    type: Number,
    required: [true, 'Minimum investment amount is required'],
    min: [0, 'Minimum investment amount cannot be negative']
  },
  levelBonus: {
    type: [Number],
    required: [true, 'Level bonus array is required'],
    validate: {
      validator: function(v) {
        return Array.isArray(v) && v.length > 0;
      },
      message: 'At least one level bonus must be specified'
    }
  },
  status: {
    type: String,
    enum: ['Active', 'Inactive'],
    default: 'Active',
    index: true
  }
}, {
  timestamps: true,
  versionKey: false
});

module.exports = mongoose.model('Plan', planSchema);
