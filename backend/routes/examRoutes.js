// backend/routes/examRoutes.js

const express = require('express');
const router = express.Router();
const examController = require('../controllers/examController');

// 1. إنشاء امتحان
router.post('/', examController.createExam);

// 2. جلب امتحانات المعلم (Query Param)
router.get('/', examController.getExamsByInstructor);

// 3. جلب كل الامتحانات
router.get('/all', examController.getAllExams);

// 4. البحث بالكود
router.get('/access/:code', examController.getExamByCode);

// 5. حذف امتحان
router.delete('/:id', examController.deleteExam);

// 6. جلب نتائج امتحان (لازم قبل الـ /:id العادية عشان الترتيب)
router.get('/:id/results', examController.getExamResults);

// 7. جلب تفاصيل امتحان واحد بالـ ID
router.get('/:id', examController.getExamById);

module.exports = router;