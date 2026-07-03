const { DataTypes } = require('sequelize');
const { sequelize } = require('../utils/db');
const User = require('./User');

const AuditLog = sequelize.define('AuditLog', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  userId: {
    type: DataTypes.INTEGER, // Can be null if system action
  },
  action: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  details: {
    type: DataTypes.STRING,
  },
  ipAddress: {
    type: DataTypes.STRING,
  },
  date: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  }
}, {
  timestamps: false,
});

User.hasMany(AuditLog, { foreignKey: 'userId', sourceKey: 'id' });
AuditLog.belongsTo(User, { foreignKey: 'userId', targetKey: 'id' });

module.exports = AuditLog;
