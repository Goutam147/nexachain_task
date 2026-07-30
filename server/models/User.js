const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: [true, 'Full name is required'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    index: true
  },
  mobileNumber: {
    type: String,
    required: [true, 'Mobile number is required'],
    trim: true
  },
  password: {
    type: String,
    required: [true, 'Password is required']
  },
  referralCode: {
    type: String,
    unique: true,
    index: true
  },
  referredBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null,
    index: true
  },
  walletBalance: {
    type: Number,
    default: 0,
    min: 0
  },
  totalRoiEarned: {
    type: Number,
    default: 0,
    min: 0
  },
  totalLevelIncomeEarned: {
    type: Number,
    default: 0,
    min: 0
  },
  accountStatus: {
    type: String,
    enum: ['Active', 'Suspended', 'Inactive'],
    default: 'Active'
  },
  role: {
    type: String,
    enum: ['admin', 'user'],
    default: 'user'
  }
}, {
  timestamps: true,
  versionKey: false
});

// Pre-save hook: Hash password and generate referral code
userSchema.pre('save', async function (next) {
  const user = this;

  // 1. Hash password if it is new or modified
  if (user.isModified('password')) {
    try {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(user.password, salt);
    } catch (err) {
      return next(err);
    }
  }

  // 2. Auto-generate a unique referral code if not present
  if (!user.referralCode) {
    try {
      let codeUnique = false;
      let generatedCode = '';
      
      // Keep generating until we find a unique one
      while (!codeUnique) {
        // Generate a random 8-character string, e.g., NEXA1234
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let randomPart = '';
        for (let i = 0; i < 4; i++) {
          randomPart += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        generatedCode = `NEXA${randomPart}`;

        // Check if code already exists in DB
        const existingUser = await mongoose.models.User.findOne({ referralCode: generatedCode });
        if (!existingUser) {
          codeUnique = true;
        }
      }
      user.referralCode = generatedCode;
    } catch (err) {
      return next(err);
    }
  }

  next();
});

// Instance method to compare password
userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model('User', userSchema);
module.exports = User;
