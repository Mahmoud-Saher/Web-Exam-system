
const Exam = require('../models/Exam');
const Question = require('../models/Question');
const Submission = require('../models/Submission');
const User = require('../models/User');

const generateCode = () => {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
};

exports.createExam = async (req, res) => {
  try {
    const { title, timeLimit, userId, questionIds } = req.body;

    let accessCode = generateCode();

    const newExam = await Exam.create({
      title,
      timeLimit,
      accessCode,
      UserId: userId
    });

    if (questionIds && questionIds.length > 0) {
      await newExam.setQuestions(questionIds);
    }

    res.status(201).json({ message: 'Exam created successfully', exam: newExam });
  } catch (error) {
    res.status(500).json({ message: 'Error creating exam', error: error.message });
  }
};

exports.getExamsByInstructor = async (req, res) => {
  try {
    const { userId } = req.query;
    const exams = await Exam.findAll({
      where: { UserId: userId },
      include: {
        model: Question,
        through: { attributes: [] }
      }
    });
    res.json(exams);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching exams', error: error.message });
  }
};

// 3. جلب جميع الامتحانات (للطالب - لو لسه بنستخدمها)
exports.getAllExams = async (req, res) => {
  try {
    const exams = await Exam.findAll();
    res.json(exams);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching exams', error: error.message });
  }
};

exports.getExamById = async (req, res) => {
  try {
    const { id } = req.params;
    const exam = await Exam.findByPk(id, {
      include: {
        model: Question,
        through: { attributes: [] }
      }
    });

    if (!exam) return res.status(404).json({ message: 'Exam not found' });
    res.json(exam);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching exam', error: error.message });
  }
};

exports.getExamByCode = async (req, res) => {
  try {
    const { code } = req.params;
    const exam = await Exam.findOne({
      where: { accessCode: code }
    });

    if (!exam) return res.status(404).json({ message: 'Invalid Access Code' });
    res.json(exam);
  } catch (error) {
    res.status(500).json({ message: 'Error finding exam', error: error.message });
  }
};

exports.deleteExam = async (req, res) => {
  try {
    const { id } = req.params;
    await Exam.destroy({ where: { id } });
    res.json({ message: 'Exam deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting exam', error: error.message });
  }
};

exports.getExamResults = async (req, res) => {
  try {
    const { id } = req.params;
    const results = await Submission.findAll({
      where: { ExamId: id },
      include: {
        model: User,
        attributes: ['username', 'email']
      },
      order: [['score', 'DESC']]
    });
    res.json(results);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching results', error: error.message });
  }
};
