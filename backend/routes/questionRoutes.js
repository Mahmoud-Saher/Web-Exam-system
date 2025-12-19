// backend/routes/questionRoutes.js

const express = require('express');
const router = express.Router();
const questionController = require('../controllers/questionController');

// POST: لإضافة سؤال
router.post('/', questionController.createQuestion);

// POST: لإضافة مجموعة أسئلة من ملف Excel
router.post('/bulk', questionController.createBulkQuestions);

// GET: لجلب الأسئلة (هتكون كده: /api/questions?userId=1)
router.get('/', questionController.getQuestionsByInstructor);
// DELETE: لحذف سؤال
router.delete('/:id', questionController.deleteQuestion);
module.exports = router;