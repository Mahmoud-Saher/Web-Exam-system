// src/pages/StudentDashboard.jsx

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import styles from './StudentDashboard.module.css';

import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Loading from '../components/ui/Loading';

function StudentDashboard() {
  const [exams, setExams] = useState([]);      
  const [history, setHistory] = useState([]);    
  const [loading, setLoading] = useState(true);  
  
  // State لكود البحث
  const [accessCode, setAccessCode] = useState('');
  const [searchError, setSearchError] = useState('');

  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));
  const userId = user ? user.id : null;

  // 1. جلب الهستري فقط
  useEffect(() => {
    const fetchHistory = async () => {
      try {
        if (!userId) return;
        const historyRes = await axios.get(`http://localhost:3001/api/submissions/history?userId=${userId}`);
        setHistory(historyRes.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching history:", error); // ✅ إصلاح الخطأ: استخدام المتغير error
        setLoading(false);
      }
    };
    fetchHistory();
  }, [userId]);

  // 2. دالة البحث عن امتحان بالكود
  const handleSearchExam = async (e) => {
    e.preventDefault();
    setSearchError('');
    
    if (!accessCode.trim()) return;

    try {
      const response = await axios.get(`http://localhost:3001/api/exams/access/${accessCode.trim()}`);
      const foundExam = response.data;

      // نتأكد إنه مش مضاف قبل كده في القائمة قدامنا
      const alreadyListed = exams.find(e => e.id === foundExam.id);
      if (alreadyListed) {
        setSearchError("This exam is already listed below.");
        return;
      }

      setExams([foundExam, ...exams]); 
      setAccessCode('');

    } catch (error) {
      console.error("Search error:", error); // ✅ إصلاح الخطأ: استخدام المتغير error
      setSearchError("Invalid Code. Exam not found.");
    }
  };

  const handleStartExam = (examId) => {
    if (window.confirm('Are you sure you want to start the exam?')) {
      navigate(`/exam/${examId}`);
    }
  };

  const getExamStatus = (examId) => {
    return history.find(sub => sub.ExamId === examId);
  };

  if (loading) return <div style={{marginTop: '50px'}}><Loading /></div>;

  return (
    <div className={styles.container}>
      
      {/* --- قسم البحث عن امتحان --- */}
      <Card style={{ marginBottom: '2rem', textAlign: 'center' }}>
        <h2 style={{ marginBottom: '1rem', color: '#1e293b' }}>Join an Exam</h2>
        <p style={{ color: '#64748b', marginBottom: '1.5rem' }}>Enter the access code provided by your instructor.</p>
        
        <form onSubmit={handleSearchExam} style={{ display: 'flex', gap: '10px', maxWidth: '400px', margin: '0 auto' }}>
          <Input 
            placeholder="Enter Exam Code (e.g. A1B2C3)" 
            value={accessCode}
            onChange={(e) => setAccessCode(e.target.value)}
            style={{ textTransform: 'uppercase' }} 
          />
          <Button type="submit" variant="primary">Find</Button>
        </form>
        
        {searchError && <p style={{ color: 'red', marginTop: '10px' }}>{searchError}</p>}
      </Card>

      {/* --- عرض الامتحانات التي تم البحث عنها --- */}
      {exams.length > 0 && (
        <>
          <h2 className={styles.title}>Found Exams</h2>
          <div className={styles.examGrid}>
            {exams.map((exam) => {
              const submission = getExamStatus(exam.id);
              const isTaken = !!submission;

              return (
                <Card key={exam.id} className={styles.examCard}>
                  <div>
                    <h2 className={styles.examTitle}>{exam.title}</h2>
                    <p className={styles.examDetails}>Time: {exam.timeLimit} mins</p>
                  </div>

                  {isTaken ? (
                    <div style={{ textAlign: 'center', marginTop: '15px' }}>
                      <div style={{ backgroundColor: '#dcfce7', color: '#166534', padding: '5px', borderRadius: '5px', marginBottom: '10px' }}>
                        Completed ✅
                      </div>
                      <Button variant="secondary" disabled className="w-full">Already Taken</Button>
                    </div>
                  ) : (
                    <div style={{ marginTop: '15px' }}>
                      <Button variant="primary" onClick={() => handleStartExam(exam.id)} className="w-full">
                        Start Exam
                      </Button>
                    </div>
                  )}
                </Card>
              );
            })}
          </div>
          <hr style={{ margin: '3rem 0', borderTop: '1px solid #e2e8f0' }} />
        </>
      )}

      {/* --- جدول الهستري --- */}
      <h2 className={styles.title} style={{ fontSize: '1.75rem' }}>My Exam History</h2>
      
      <Card>
        {history.length === 0 ? (
          <div style={{ padding: '2rem', textAlign: 'center', color: '#64748b' }}>
            You haven't taken any exams yet.
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table className={styles.historyTable}>
              <thead>
                <tr>
                  <th>Exam Name</th>
                  <th>Date</th>
                  <th>Score</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {history.map((sub) => {
                  const percent = sub.totalQuestions > 0 ? ((sub.score / sub.totalQuestions) * 100).toFixed(1) : 0;
                  const isPassed = percent >= 50;
                  return (
                    <tr key={sub.id}>
                      <td>{sub.Exam ? sub.Exam.title : 'Deleted Exam'}</td>
                      <td>{new Date(sub.createdAt).toLocaleDateString()}</td>
                      <td style={{ fontFamily: 'monospace', fontWeight: 'bold' }}>{sub.score} / {sub.totalQuestions}</td>
                      <td>
                        <span className={`${styles.badge} ${isPassed ? styles.badgeSuccess : styles.badgeFail}`}>
                          {isPassed ? 'Passed' : 'Failed'} ({percent}%)
                        </span>
                      </td>
                      <td>
                        <Button variant="secondary" style={{ padding: '5px 10px', fontSize: '0.8rem' }} onClick={() => navigate(`/review/${sub.id}`)}>
                          Review 👁️
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}

export default StudentDashboard;