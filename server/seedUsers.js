const bcrypt = require('bcrypt');
const { connectDB } = require('./utils/db');
const User = require('./models/User');
require('dotenv').config();

const seedUsers = async () => {
  try {
    await connectDB();
    
    // Load credentials from .env with fallbacks
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@bank.com';
    const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';
    
    const employeeEmail = process.env.EMPLOYEE_EMAIL || 'employee@bank.com';
    const employeePassword = process.env.EMPLOYEE_PASSWORD || 'emp123';
    
    const managerEmail = process.env.MANAGER_EMAIL || 'manager@bank.com';
    const managerPassword = process.env.MANAGER_PASSWORD || 'mgr123';

    // Check if admin already exists
    const adminExists = await User.findOne({ where: { email: adminEmail } });
    
    if (!adminExists) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(adminPassword, salt);
      
      await User.create({
        name: 'System Admin',
        email: adminEmail,
        phone: '9999999999',
        password: hashedPassword,
        role: 'admin',
      });
      console.log(`✅ Admin user created: ${adminEmail} / ${adminPassword}`);
    } else {
      console.log(`⚠️ Admin user already exists (${adminEmail}).`);
    }

    // Check if employee already exists
    const employeeExists = await User.findOne({ where: { email: employeeEmail } });
    
    if (!employeeExists) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(employeePassword, salt);
      
      await User.create({
        name: 'Bank Employee',
        email: employeeEmail,
        phone: '8888888888',
        password: hashedPassword,
        role: 'employee',
      });
      console.log(`✅ Employee user created: ${employeeEmail} / ${employeePassword}`);
    } else {
      console.log(`⚠️ Employee user already exists (${employeeEmail}).`);
    }

    // Check if manager already exists
    const managerExists = await User.findOne({ where: { email: managerEmail } });
    
    if (!managerExists) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(managerPassword, salt);
      
      await User.create({
        name: 'Bank Manager',
        email: managerEmail,
        phone: '7777777777',
        password: hashedPassword,
        role: 'manager',
      });
      console.log(`✅ Manager user created: ${managerEmail} / ${managerPassword}`);
    } else {
      console.log(`⚠️ Manager user already exists (${managerEmail}).`);
    }

    process.exit();
  } catch (error) {
    console.error('❌ Error seeding users:', error);
    process.exit(1);
  }
};

seedUsers();
