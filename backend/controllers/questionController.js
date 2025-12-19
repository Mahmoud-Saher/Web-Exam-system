// backend/controllers/questionController.js

const Question = require('../models/Question');

// 1. إضافة سؤال جديد
exports.createQuestion = async (req, res) => {
  try {
    // البيانات اللي جاية من الفرونت اند
    // userId مهم جداً عشان نعرف مين المعلم اللي حط السؤال
    const { text, options, correctAnswerIndex, userId } = req.body;

    const newQuestion = await Question.create({
      text,
      options,
      correctAnswerIndex,
      UserId: userId // ربط السؤال بالمعلم
    });

    res.status(201).json(newQuestion);
  } catch (error) {
    res.status(500).json({ message: 'Error creating question', error: error.message });
  }
};

// 2. جلب جميع أسئلة معلم معين
exports.getQuestionsByInstructor = async (req, res) => {
  try {
    const { userId } = req.query; // هنجيب الـ ID من الرابط

    const questions = await Question.findAll({
      where: { UserId: userId }
    });

    res.json(questions);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching questions', error: error.message });
  }
};  

// 3. إضافة مجموعة أسئلة من Excel (Bulk Insert)
exports.createBulkQuestions = async (req, res) => {
  try {
    const { questions, userId } = req.body; // questions عبارة عن مصفوفة

    // إضافة الـ userId لكل سؤال في المصفوفة
    const questionsWithUser = questions.map(q => ({
      ...q,
      UserId: userId
    }));

    // أمر Sequelize السحري لإضافة مجموعة دفعة واحدة
    await Question.bulkCreate(questionsWithUser);

    res.status(201).json({ message: 'Questions imported successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error importing questions', error: error.message });
  }
};

// 4. حذف سؤال
exports.deleteQuestion = async (req, res) => {
  try {
    const { id } = req.params;
    await Question.destroy({ where: { id } });
    res.json({ message: 'Question deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting question', error: error.message });
  }
};