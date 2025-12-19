const express = require('express');
const router = express.Router();
const submissionController = require('../controllers/submissionController');

// POST: إرسال الحل
router.post('/', submissionController.submitExam);
// GET: جلب سجل الامتحانات للطالب
router.get('/history', submissionController.getStudentHistory); 
module.exports = router;