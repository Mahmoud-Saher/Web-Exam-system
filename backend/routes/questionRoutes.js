
const express = require('express');
const router = express.Router();
const questionController = require('../controllers/questionController');

router.post('/', questionController.createQuestion);

router.post('/bulk', questionController.createBulkQuestions);

router.get('/', questionController.getQuestionsByInstructor);
router.delete('/:id', questionController.deleteQuestion);
module.exports = router;
