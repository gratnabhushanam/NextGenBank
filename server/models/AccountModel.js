const { DataTypes } = require('sequelize');
const { sequelize } = require('../utils/db');

const AccountModel = sequelize.define('Account', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  accountNumber: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  holderName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  branch: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  ifsc: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  panNumber: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  aadhaarNumber: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  nominee: {
    type: DataTypes.STRING,
  },
  businessName: {
    type: DataTypes.STRING, // Optional, for Current Accounts
  },
  accountType: {
    type: DataTypes.ENUM('Savings', 'Current', 'FixedDeposit'),
    allowNull: false,
  },
  balance: {
    type: DataTypes.FLOAT,
    allowNull: false,
    defaultValue: 0,
  },
  interestRate: {
    type: DataTypes.FLOAT,
    defaultValue: 4.0,
  },
  withdrawalLimit: {
    type: DataTypes.FLOAT,
    defaultValue: 50000,
  },
  overdraftLimit: {
    type: DataTypes.FLOAT,
    defaultValue: 10000,
  },
  lockInPeriod: {
    type: DataTypes.INTEGER,
    defaultValue: 12, // months
  },
  maturityDate: {
    type: DataTypes.DATE,
  },
  penaltyPercentage: {
    type: DataTypes.FLOAT,
    defaultValue: 2.0,
  },
  status: {
    type: DataTypes.STRING,
    defaultValue: 'Active',
  }
}, {
  timestamps: true,
});

module.exports = AccountModel;
