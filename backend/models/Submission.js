// backend/models/Submission.js

const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Submission = sequelize.define('Submission', {
  score: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  totalQuestions: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  // ممكن نخزن الإجابات التفصيلية كـ JSON لو حبينا نعمل "مراجعة" بعدين
  answers: {
    type: DataTypes.JSON, 
    allowNull: true
  }
});

module.exports = Submission;