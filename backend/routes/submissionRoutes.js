const express = require('express');
const router = express.Router();
const submissionController = require('../controllers/submissionController');

router.post('/', submissionController.submitExam);
router.get('/history', submissionController.getStudentHistory); 
module.exports = router;
