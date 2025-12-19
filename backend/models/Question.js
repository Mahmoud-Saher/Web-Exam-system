const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Question = sequelize.define('Question', {
  text: {
    type: DataTypes.STRING,
    allowNull: false
  },
  options: {
    type: DataTypes.JSON, // ["Option A", "Option B", ...]
    allowNull: false
  },
  correctAnswerIndex: {
    type: DataTypes.INTEGER, // 0, 1, 2, or 3
    allowNull: false
  }
});

module.exports = Question;