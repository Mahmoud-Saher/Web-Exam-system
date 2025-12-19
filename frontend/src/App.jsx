
import React from 'react';
import { Routes, Route } from 'react-router-dom';

import AuthPage from './pages/AuthPage';
import StudentDashboard from './pages/StudentDashboard';
import InstructorDashboard from './pages/InstructorDashboard';
import ExamPage from './pages/ExamPage';
import ResultsPage from './pages/ResultsPage';

import MainLayout from './components/layout/MainLayout';

function App() {
  return (
    <Routes>
      <Route path="/login" element={<AuthPage />} />
      <Route path="/" element={<AuthPage />} />

     
      <Route element={<MainLayout />}>
        <Route path="/student" element={<StudentDashboard />} />
        <Route path="/instructor" element={<InstructorDashboard />} />
        <Route path="/exam/:examId" element={<ExamPage />} />
        <Route path="/results" element={<ResultsPage />} />
      </Route>
    </Routes>
  );
}

export default App;
