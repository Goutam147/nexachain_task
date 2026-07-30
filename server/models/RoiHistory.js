const mongoose = require('mongoose');

const roiHistorySchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User reference is required'],
    index: true
  },
  investment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Investment',
    required: [true, 'Investment reference is required'],
    index: true
  },
  amount: {
    type: Number,
    required: [true, 'ROI amount is required'],
    min: [0, 'ROI amount cannot be negative']
  },
  date: {
    type: Date,
    required: true,
    default: Date.now,
    index: true
  },
  status: {
    type: String,
    enum: ['Credited', 'Failed'],
    default: 'Credited',
    index: true
  }
}, {
  timestamps: true,
  versionKey: false
});

const RoiHistory = mongoose.model('RoiHistory', roiHistorySchema);
module.exports = RoiHistory;
