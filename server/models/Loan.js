const { DataTypes } = require('sequelize');
const { sequelize } = require('../utils/db');

const Loan = sequelize.define('Loan', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  customerId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  amount: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  interestRate: {
    type: DataTypes.FLOAT,
    allowNull: false,
    defaultValue: 10.5
  },
  durationMonths: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  loanType: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'Personal Loan'
  },
  panCardUrl: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  aadhaarCardUrl: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  propertyDocUrl: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  termsAccepted: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  status: {
    type: DataTypes.ENUM('Pending', 'Approved', 'Rejected', 'Paid'),
    defaultValue: 'Pending'
  },
  assignedManagerId: {
    type: DataTypes.INTEGER,
    allowNull: true
  }
}, {
  timestamps: true,
});

module.exports = Loan;
