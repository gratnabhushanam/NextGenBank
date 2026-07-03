const { DataTypes } = require('sequelize');
const { sequelize } = require('../utils/db');
const AccountModel = require('./AccountModel');

const Transaction = sequelize.define('Transaction', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  accountNumber: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  transactionType: {
    type: DataTypes.ENUM('Deposit', 'Withdrawal', 'Interest Credit', 'Penalty Deduction'),
    allowNull: false,
  },
  amount: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  balanceAfterTransaction: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  description: {
    type: DataTypes.STRING,
  },
  date: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  }
}, {
  timestamps: false,
});

// Associations
AccountModel.hasMany(Transaction, { foreignKey: 'accountNumber', sourceKey: 'accountNumber' });
Transaction.belongsTo(AccountModel, { foreignKey: 'accountNumber', targetKey: 'accountNumber' });

module.exports = Transaction;
