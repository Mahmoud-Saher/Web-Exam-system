// src/pages/ResultsPage.jsx

import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';

function ResultsPage() {
  const location = useLocation();
  const navigate = useNavigate();
  
  // استقبال البيانات اللي جاية من صفحة الامتحان
  const resultData = location.state;

  if (!resultData) {
    return <div className="p-10 text-center">No results found.</div>;
  }

  const { score, total, percentage } = resultData;

  return (
    <div style={{ padding: '2rem', display: 'flex', justifyContent: 'center' }}>
      <Card style={{ textAlign: 'center', maxWidth: '500px', width: '100%' }}>
        <h1 style={{ color: '#1f2937', marginBottom: '1rem' }}>Exam Completed! 🎉</h1>
        
        <div style={{ margin: '2rem 0' }}>
          <h2 style={{ fontSize: '4rem', color: '#2563eb', margin: 0 }}>{score} / {total}</h2>
          <p style={{ fontSize: '1.5rem', color: '#4b5563', marginTop: '0.5rem' }}>
            Score: {percentage}%
          </p>
        </div>

        <div style={{ padding: '1rem', backgroundColor: percentage >= 50 ? '#dcfce7' : '#fee2e2', borderRadius: '8px', marginBottom: '2rem' }}>
          <h3 style={{ color: percentage >= 50 ? '#166534' : '#991b1b', margin: 0 }}>
            {percentage >= 50 ? 'Congratulations! You Passed.' : 'Good luck next time!'}
          </h3>
        </div>

        <Button variant="primary" onClick={() => navigate('/student')} className="w-full">
          Back to Dashboard
        </Button>
      </Card>
    </div>
  );
}

export default ResultsPage;