
const Question = require('../models/Question');

exports.createQuestion = async (req, res) => {
  try {
    const { text, options, correctAnswerIndex, userId } = req.body;

    const newQuestion = await Question.create({
      text,
      options,
      correctAnswerIndex,
      UserId: userId 
    });

    res.status(201).json(newQuestion);
  } catch (error) {
    res.status(500).json({ message: 'Error creating question', error: error.message });
  }
};

exports.getQuestionsByInstructor = async (req, res) => {
  try {
    const { userId } = req.query; 

    const questions = await Question.findAll({
      where: { UserId: userId }
    });

    res.json(questions);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching questions', error: error.message });
  }
};  

exports.createBulkQuestions = async (req, res) => {
  try {
    const { questions, userId } = req.body; 

    const questionsWithUser = questions.map(q => ({
      ...q,
      UserId: userId
    }));

    await Question.bulkCreate(questionsWithUser);

    res.status(201).json({ message: 'Questions imported successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error importing questions', error: error.message });
  }
};

exports.deleteQuestion = async (req, res) => {
  try {
    const { id } = req.params;
    await Question.destroy({ where: { id } });
    res.json({ message: 'Question deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting question', error: error.message });
  }
};
