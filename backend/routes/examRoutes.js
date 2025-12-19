
const express = require('express');
const router = express.Router();
const examController = require('../controllers/examController');

router.post('/', examController.createExam);

router.get('/', examController.getExamsByInstructor);

router.get('/all', examController.getAllExams);

router.get('/access/:code', examController.getExamByCode);

router.delete('/:id', examController.deleteExam);

router.get('/:id/results', examController.getExamResults);

router.get('/:id', examController.getExamById);

module.exports = router;
