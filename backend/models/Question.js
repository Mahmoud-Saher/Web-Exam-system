const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Question = sequelize.define('Question', {
  text: {
    type: DataTypes.STRING,
    allowNull: false
  },
  options: {
    type: DataTypes.JSON, 
  },
  correctAnswerIndex: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
});

module.exports = Question;
