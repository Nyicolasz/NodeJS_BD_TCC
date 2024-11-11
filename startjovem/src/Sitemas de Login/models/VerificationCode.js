// models/verificationCode.js
const { DataTypes } = require('sequelize');
const sequelize = require('../../database/database');

const VerificationCode = sequelize.define('VerificationCode', {
  email: {
    type: DataTypes.STRING,
    allowNull: false
  },
  code: {
    type: DataTypes.STRING,
    allowNull: false
  },
  expiresAt: {
    type: DataTypes.DATE,
    allowNull: false
  }
});

module.exports = VerificationCode;
