const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('exam_system_db', 'root', '12345', {
  host: 'localhost',
  dialect: 'mysql',
  logging: false 
});

const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log(' Database connected...');
  } catch (error) {
    console.error(' Connection error:', error);
  }
};

module.exports = { sequelize, connectDB };
