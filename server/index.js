const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

// Global Timezone configuration
process.env.TZ = process.env.TZ || 'Asia/Kolkata';

const connectDB = require('./config/db');
const seedAdmin = require('./utils/seeder');

const app = express();
const PORT = process.env.PORT || 5000;

// Rate limiting middleware
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  message: { message: 'Too many requests from this IP, please try again after 15 minutes' }
});

// Middlewares
app.use(cors());
app.use(express.json());
app.use(limiter);

// Root route
app.get('/', (req, res) => {
  res.json({
    status: 'success',
    message: 'NC Investment Backend Server API is running'
  });
});

// Auth Routes
app.use('/api/auth', require('./routes/authRoutes'));

// Plan Routes
app.use('/api/plans', require('./routes/planRoutes'));

// Investment Routes
app.use('/api/investments', require('./routes/investmentRoutes'));

// Referral Routes
app.use('/api/referrals', require('./routes/referralRoutes'));

// Dashboard Routes
app.use('/api/dashboard', require('./routes/dashboardRoutes'));

// ROI Routes
app.use('/api/roi', require('./routes/roiRoutes'));

// Cron Routes
app.use('/api/cron', require('./routes/cronRoutes'));

// Import Cron Scheduler
const { initCronScheduler } = require('./services/cronService');

// Boot Server after DB connection
connectDB().then(() => {
  // Seed default admin user
  seedAdmin();

  // Initialize automated cron scheduler tasks (12:00 AM daily)
  initCronScheduler();

  // Start Server
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
});
