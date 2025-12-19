// src/App.jsx

import React from 'react';
import { Routes, Route } from 'react-router-dom';

// استيراد الصفحات
import AuthPage from './pages/AuthPage';
import StudentDashboard from './pages/StudentDashboard';
import InstructorDashboard from './pages/InstructorDashboard';
import ExamPage from './pages/ExamPage';
import ResultsPage from './pages/ResultsPage';

// 1. استيراد التخطيط الجديد
import MainLayout from './components/layout/MainLayout';

function App() {
  return (
    <Routes>
      {/* 2. الصفحات التي لا تحتوي على هيدر (مثل اللوجن) */}
      <Route path="/login" element={<AuthPage />} />
      <Route path="/" element={<AuthPage />} />

      {/* 3. الصفحات التي تحتوي على الهيدر (داخل التخطيط) */}
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