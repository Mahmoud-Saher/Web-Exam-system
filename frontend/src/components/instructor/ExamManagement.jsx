// src/components/instructor/ExamManagement.jsx

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaTrash, FaChartBar } from 'react-icons/fa'; 
import styles from './ExamManagement.module.css';

import Card from '../ui/Card';
import Input from '../ui/Input';
import Button from '../ui/Button';

function ExamManagement() {
  const [availableQuestions, setAvailableQuestions] = useState([]);
  const [exams, setExams] = useState([]);
  
  // States للفورم
  const [title, setTitle] = useState('');
  const [timeLimit, setTimeLimit] = useState(60);
  const [selectedQuestions, setSelectedQuestions] = useState([]); 

  // States لعرض النتائج
  const [selectedExamResults, setSelectedExamResults] = useState(null);
  const [showResultsId, setShowResultsId] = useState(null);

  const user = JSON.parse(localStorage.getItem('user'));
  const userId = user ? user.id : null;

  // 1. جلب البيانات عند التحميل
  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!userId) return;
        
        // جلب الأسئلة
        const questionsRes = await axios.get(`http://localhost:3001/api/questions?userId=${userId}`);
        setAvailableQuestions(questionsRes.data);

        // جلب الامتحانات
        const examsRes = await axios.get(`http://localhost:3001/api/exams?userId=${userId}`);
        setExams(examsRes.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, [userId]);

  // 2. حذف امتحان
  const handleDeleteExam = async (examId) => {
    if (!window.confirm("Delete this exam? All student submissions for this exam will be lost!")) return;
    try {
      await axios.delete(`http://localhost:3001/api/exams/${examId}`);
      setExams(exams.filter(e => e.id !== examId));
      
      if (showResultsId === examId) {
        setShowResultsId(null);
        setSelectedExamResults(null);
      }
    } catch (error) {
      console.error("Error deleting exam:", error);
      alert("Failed to delete exam");
    }
  };

  // 3. عرض النتائج
  const handleViewResults = async (examId) => {
    if (showResultsId === examId) {
      setShowResultsId(null);
      setSelectedExamResults(null);
      return;
    }

    try {
      const res = await axios.get(`http://localhost:3001/api/exams/${examId}/results`);
      setSelectedExamResults(res.data);
      setShowResultsId(examId);
    } catch (error) {
      console.error("Error fetching results:", error);
      alert("Error fetching results");
    }
  };

  // 4. اختيار الأسئلة
  const handleQuestionToggle = (qId) => {
    setSelectedQuestions((prev) => 
      prev.includes(qId) ? prev.filter((id) => id !== qId) : [...prev, qId]
    );
  };

  // 5. إنشاء امتحان
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (selectedQuestions.length === 0) {
      alert('Please select at least one question.');
      return;
    }
    
    try {
      const examData = {
        title,
        timeLimit: Number(timeLimit),
        userId: userId,
        questionIds: selectedQuestions
      };

      const response = await axios.post('http://localhost:3001/api/exams', examData);

      // إضافة الامتحان الجديد للقائمة
      setExams([...exams, response.data.exam]);
      
      // إعادة تعيين الفورم
      setTitle('');
      setTimeLimit(60);
      setSelectedQuestions([]);
      alert('Exam created successfully!');

    } catch (error) {
      console.error("Error creating exam:", error);
      alert('Failed to create exam');
    }
  };

  return (
    <div className={styles.gridContainer}>
      {/* العمود الأول: إنشاء امتحان */}
      <Card>
        <h3>Create New Exam</h3>
        <form className={styles.form} onSubmit={handleSubmit}>
          
          <div className={styles.formGroup}>
            <label className={styles.label}>Exam Title</label>
            <Input
              placeholder="e.g., Final Exam"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Time Limit (minutes)</label>
            <Input
              type="number"
              value={timeLimit}
              onChange={(e) => setTimeLimit(e.target.value)}
              min="1"
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Select Questions</label>
            <div className={styles.questionList}>
              {availableQuestions.map((q) => (
                <label key={q.id} className={styles.questionItem}>
                  <input
                    type="checkbox"
                    className={styles.checkbox}
                    checked={selectedQuestions.includes(q.id)}
                    onChange={() => handleQuestionToggle(q.id)}
                  />
                  <span>{q.text}</span>
                </label>
              ))}
            </div>
          </div>

          <Button type="submit" variant="primary">
            Create Exam
          </Button>
        </form>
      </Card>

      {/* العمود الثاني: قائمة الامتحانات */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <Card>
          <h3>Your Exams ({exams.length})</h3>
          <div className={styles.examList}>
            {exams.length === 0 && <p>No exams created yet.</p>}
            
            {exams.map((exam) => (
              <div key={exam.id} className={styles.examItem}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                  <div>
                    <h4 className={styles.examTitle}>{exam.title}</h4>
                    <p className={styles.examDetails}>
                      {exam.questionCount} questions | {exam.timeLimit} minutes
                    </p>
                    
                    {/* --- عرض كود الامتحان (الجزء الجديد) --- */}
                    <div style={{ 
                      marginTop: '10px', 
                      backgroundColor: '#f0f9ff', 
                      border: '1px dashed #2563eb', 
                      padding: '5px 10px', 
                      borderRadius: '5px',
                      color: '#2563eb',
                      fontWeight: 'bold',
                      display: 'inline-block',
                      fontSize: '0.9rem'
                    }}>
                      Code: {exam.accessCode}
                    </div>
                    {/* -------------------------------------- */}

                  </div>
                  
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button 
                      onClick={() => handleViewResults(exam.id)}
                      style={{ color: '#2563eb', background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.2rem' }}
                      title="View Results"
                    >
                      <FaChartBar />
                    </button>
                    
                    <button 
                      onClick={() => handleDeleteExam(exam.id)}
                      style={{ color: '#dc2626', background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.1rem' }}
                      title="Delete Exam"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>

                {/* قسم عرض النتائج */}
                {showResultsId === exam.id && (
                  <div style={{ marginTop: '1rem', borderTop: '1px solid #eee', paddingTop: '1rem' }}>
                    <h5 style={{ marginBottom: '0.5rem', color: '#333' }}>Student Results:</h5>
                    
                    {(!selectedExamResults || selectedExamResults.length === 0) ? (
                      <p style={{ fontSize: '0.9rem', color: '#777' }}>No submissions yet.</p>
                    ) : (
                      <table style={{ width: '100%', fontSize: '0.9rem' }}>
                        <thead>
                          <tr style={{ textAlign: 'left', color: '#555' }}>
                            <th style={{paddingBottom: '5px'}}>Name</th>
                            <th style={{paddingBottom: '5px'}}>Score</th>
                          </tr>
                        </thead>
                        <tbody>
                          {selectedExamResults.map((res) => (
                            <tr key={res.id} style={{ borderBottom: '1px solid #f9f9f9' }}>
                              <td style={{ padding: '5px 0' }}>{res.User ? res.User.username : 'Unknown'}</td>
                              <td style={{ fontWeight: 'bold', color: res.score/res.totalQuestions >= 0.5 ? 'green' : 'red' }}>
                                {res.score}/{res.totalQuestions}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}

export default ExamManagement;
