const User = require('../models/User');

const seedAdmin = async () => {
  try {
    const adminExists = await User.findOne({ email: 'admin@gmail.com' });
    if (adminExists) {
      console.log('Seeding skipped: Admin user admin@gmail.com already exists');
      return;
    }

    const admin = new User({
      fullName: 'Admin',
      email: 'admin@gmail.com',
      mobileNumber: '9999999999',
      password: '123456',
      role: 'admin',
      accountStatus: 'Active'
    });

    await admin.save();
    console.log('Seeding complete: Admin user admin@gmail.com created successfully');
  } catch (error) {
    console.error(`Database seeding error: ${error.message}`);
  }
};

module.exports = seedAdmin;
