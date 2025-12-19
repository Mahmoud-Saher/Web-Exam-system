// backend/controllers/submissionController.js

const Submission = require('../models/Submission');
const Exam = require('../models/Exam');
const Question = require('../models/Question');

exports.submitExam = async (req, res) => {
  try {
    const { userId, examId, answers } = req.body; 
    // answers جاية كده: { '1': 0, '2': 3 } (رقم السؤال : رقم الاختيار)

    // 1. نجيب الامتحان بأسئلته من الداتابيز (عشان نعرف الإجابات الصح)
    const exam = await Exam.findByPk(examId, {
      include: { model: Question }
    });

    if (!exam) return res.status(404).json({ message: 'Exam not found' });

    let score = 0;
    const totalQuestions = exam.Questions.length;

    // 2. عملية التصحيح (Loop)
    exam.Questions.forEach(question => {
      // إجابة الطالب لهذا السؤال
      const studentAnswerIndex = answers[question.id];
      
      // الإجابة الصحيحة من الداتابيز
      const correctAnswerIndex = question.correctAnswerIndex;

      // المقارنة
      if (studentAnswerIndex !== undefined && studentAnswerIndex === correctAnswerIndex) {
        score++; // زود درجة
      }
    });

    // 3. حفظ النتيجة في الداتابيز
    const submission = await Submission.create({
      score,
      totalQuestions,
      answers, // بنحفظ اجابات الطالب عشان المراجعة
      UserId: userId,
      ExamId: examId
    });

    // 4. إرجاع النتيجة للطالب
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

// 2. جلب سجل امتحانات طالب معين
exports.getStudentHistory = async (req, res) => {
  try {
    const { userId } = req.query; // هنجيب الـ ID من الرابط

    const history = await Submission.findAll({
      where: { UserId: userId },
      include: {
        model: Exam, // عشان نجيب اسم الامتحان
        attributes: ['title', 'timeLimit']
      },
      order: [['createdAt', 'DESC']] // الأحدث أولاً
    });

    res.json(history);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching history', error: error.message });
  }
};