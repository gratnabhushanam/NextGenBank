const { DataTypes } = require('sequelize');
const { sequelize } = require('../utils/db');
const User = require('./User');

const Notification = sequelize.define('Notification', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  message: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  type: {
    type: DataTypes.ENUM('Deposit Successful', 'Withdrawal Successful', 'Transfer Successful', 'Interest Credited', 'Penalty Applied', 'Login Successful', 'Profile Updated'),
    allowNull: false,
  },
  isRead: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  date: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  }
}, {
  timestamps: false,
});

// Associations
User.hasMany(Notification, { foreignKey: 'userId', sourceKey: 'id' });
Notification.belongsTo(User, { foreignKey: 'userId', targetKey: 'id' });

module.exports = Notification;
