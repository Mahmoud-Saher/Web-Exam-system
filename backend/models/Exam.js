const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Exam = sequelize.define('Exam', {
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  timeLimit: {
    type: DataTypes.INTEGER,
    defaultValue: 60
  },
 
  accessCode: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  }
});

module.exports = Exam;