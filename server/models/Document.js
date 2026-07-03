const { DataTypes } = require('sequelize');
const { sequelize } = require('../utils/db');

const Document = sequelize.define('Document', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  documentType: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  filePath: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  verificationStatus: {
    type: DataTypes.ENUM('Pending', 'Verified', 'Rejected'),
    defaultValue: 'Pending'
  },
  verifiedByEmployeeId: {
    type: DataTypes.INTEGER,
    allowNull: true
  }
}, {
  timestamps: true,
});

module.exports = Document;
