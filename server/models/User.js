const { DataTypes } = require('sequelize');
const { sequelize } = require('../utils/db');

const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true,
    }
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  address: {
    type: DataTypes.STRING,
  },
  profilePicture: {
    type: DataTypes.STRING,
    defaultValue: 'default.jpg'
  },
  role: {
    type: DataTypes.ENUM('customer', 'employee', 'manager', 'admin'),
    defaultValue: 'customer',
  },
  kycStatus: {
    type: DataTypes.ENUM('Pending', 'Verified', 'Rejected'),
    defaultValue: 'Pending'
  }
}, {
  timestamps: true,
});

module.exports = User;
