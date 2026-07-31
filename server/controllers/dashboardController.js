const dashboardService = require('../services/dashboardService');

/**
 * GET /api/dashboard — Get dynamic dashboard data for user portal
 */
const getDashboardData = async (req, res) => {
  try {
    const data = await dashboardService.getUserDashboardData(req.user._id);
    res.json({
      status: 'success',
      data
    });
  } catch (error) {
    console.error('Error fetching dashboard data:', error.message);
    res.status(500).json({
      status: 'error',
      message: error.message || 'Failed to fetch dashboard data'
    });
  }
};

/**
 * GET /api/dashboard/admin — Get dynamic dashboard data for admin portal
 */
const getAdminDashboard = async (req, res) => {
  try {
    // Safety check: ensure user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        status: 'error',
        message: 'Access denied: Admin only'
      });
    }

    const data = await dashboardService.getAdminDashboardData();
    res.json({
      status: 'success',
      data
    });
  } catch (error) {
    console.error('Error fetching admin dashboard data:', error.message);
    res.status(500).json({
      status: 'error',
      message: error.message || 'Failed to fetch admin dashboard data'
    });
  }
};

module.exports = {
  getDashboardData,
  getAdminDashboard
};
