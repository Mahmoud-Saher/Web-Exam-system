

import React, { useState } from 'react';
import styles from './InstructorDashboard.module.css';

import QuestionBank from '../components/instructor/QuestionBank';
import ExamManagement from '../components/instructor/ExamManagement'; 

function InstructorDashboard() {
  const [view, setView] = useState('exams'); 

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Instructor Dashboard</h1>
      
      <div className={styles.tabNav}>
        <button
          className={`${styles.tabButton} ${view === 'exams' ? styles.activeTab : ''}`}
          onClick={() => setView('exams')}
        >
          Manage Exams
        </button>
        <button
          className={`${styles.tabButton} ${view === 'questions' ? styles.activeTab : ''}`}
          onClick={() => setView('questions')}
        >
          Question Bank
        </button>
      </div>

      <div>
        {view === 'exams' && (
          <ExamManagement />
        )}

        {view === 'questions' && (
          <QuestionBank /> 
        )}
      </div>
    </div>
  );
}

export default InstructorDashboard;
