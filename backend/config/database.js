const { Sequelize } = require('sequelize');

// إعداد الاتصال بقاعدة البيانات
// ('اسم_القاعدة', 'اسم_المستخدم', 'الباسورد')
const sequelize = new Sequelize('exam_system_db', 'root', '12345', {
  host: 'localhost',
  dialect: 'mysql',
  logging: false // عشان منزحمش التيرمينال
});

const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Database connected...');
  } catch (error) {
    console.error('❌ Connection error:', error);
  }
};

module.exports = { sequelize, connectDB };
