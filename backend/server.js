const express = require('express');
const cors = require('cors');
const { connectDB, sequelize } = require('./config/database');

// 1. استيراد الموديلز
const User = require('./models/User');
const Question = require('./models/Question');
const Exam = require('./models/Exam');
const Submission = require('./models/Submission'); // الموديل

const submissionRoutes = require('./routes/submissionRoutes'); // الراوت
const authRoutes = require('./routes/authRoutes');
const questionRoutes = require('./routes/questionRoutes');
const examRoutes = require('./routes/examRoutes');

const app = express();
app.use(cors());
app.use(express.json());
// تسجيل الراوتس
app.use('/api/exams', examRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/questions', questionRoutes);
app.use('/api/submissions', submissionRoutes);

// 2. تعريف العلاقات (مين يملك مين؟)
// الطالب (User) له نتائج (Submissions)
User.hasMany(Submission);
Submission.belongsTo(User);

// الامتحان (Exam) له نتائج
Exam.hasMany(Submission);
Submission.belongsTo(Exam);

// المعلم يملك أسئلة وامتحانات
User.hasMany(Question);
Question.belongsTo(User);

User.hasMany(Exam);
Exam.belongsTo(User);

// الامتحان والأسئلة (علاقة متداخلة Many-to-Many)
// يعني الامتحان فيه أسئلة كتير، والسؤال ممكن يتحط في كذا امتحان
Exam.belongsToMany(Question, { through: 'ExamQuestions' });
Question.belongsToMany(Exam, { through: 'ExamQuestions' });


// 3. تشغيل السيرفر وبناء الجداول
const PORT = 3001;

const startServer = async () => {
  try {
    await connectDB();
    
    // الأمر السحري: ده اللي هيروح الداتابيز وينشئ الجداول
    await sequelize.sync({ alter: true });
    console.log('✅ All Tables created successfully!');

    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });

  } catch (error) {
    console.error('❌ Error starting server:', error);
  }
};

startServer();