
const Submission = require('../models/Submission');
const Exam = require('../models/Exam');
const Question = require('../models/Question');

exports.submitExam = async (req, res) => {
  try {
    const { userId, examId, answers } = req.body; 

    const exam = await Exam.findByPk(examId, {
      include: { model: Question }
    });

    if (!exam) return res.status(404).json({ message: 'Exam not found' });

    let score = 0;
    const totalQuestions = exam.Questions.length;

    exam.Questions.forEach(question => {
      const studentAnswerIndex = answers[question.id];
      
      const correctAnswerIndex = question.correctAnswerIndex;

      if (studentAnswerIndex !== undefined && studentAnswerIndex === correctAnswerIndex) {
        score++; 
      }
    });

    const submission = await Submission.create({
      score,
      totalQuestions,
      answers, 
      UserId: userId,
      ExamId: examId
    });

    res.json({
      message: 'Exam submitted successfully',
      score: score,
      total: totalQuestions,
      percentage: ((score / totalQuestions) * 100).toFixed(1)
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error submitting exam', error: error.message });
  }
};

exports.getStudentHistory = async (req, res) => {
  try {
    const { userId } = req.query;  

    const history = await Submission.findAll({
      where: { UserId: userId },
      include: {
        model: Exam,  
        attributes: ['title', 'timeLimit']
      },
      order: [['createdAt', 'DESC']] ا
    });

    res.json(history);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching history', error: error.message });
  }
};
