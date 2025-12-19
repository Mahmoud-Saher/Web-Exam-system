const express = require('express');
const cors = require('cors');
const { connectDB, sequelize } = require('./config/database');

const User = require('./models/User');
const Question = require('./models/Question');
const Exam = require('./models/Exam');
const Submission = require('./models/Submission'); 

const submissionRoutes = require('./routes/submissionRoutes'); 
const authRoutes = require('./routes/authRoutes');
const questionRoutes = require('./routes/questionRoutes');
const examRoutes = require('./routes/examRoutes');

const app = express();
app.use(cors());
app.use(express.json());
app.use('/api/exams', examRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/questions', questionRoutes);
app.use('/api/submissions', submissionRoutes);

User.hasMany(Submission);
Submission.belongsTo(User);

Exam.hasMany(Submission);
Submission.belongsTo(Exam);

User.hasMany(Question);
Question.belongsTo(User);

User.hasMany(Exam);
Exam.belongsTo(User);

Exam.belongsToMany(Question, { through: 'ExamQuestions' });
Question.belongsToMany(Exam, { through: 'ExamQuestions' });


const PORT = 3001;

const startServer = async () => {
  try {
    await connectDB();
    
    await sequelize.sync({ alter: true });
    console.log('All Tables created successfully!');

    app.listen(PORT, () => {
      console.log(` Server running on http://localhost:${PORT}`);
    });

  } catch (error) {
    console.error('❌ Error starting server:', error);
  }
};

startServer();
