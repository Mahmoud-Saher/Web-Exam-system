// src/components/layout/MainLayout.jsx

import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header'; // استيراد الهيدر

function MainLayout() {
  return (
    <div>
      <Header />
      <main style={{ padding: '2rem' }}>
        {/* <Outlet> هو المكان الذي ستعرض فيه الصفحات (مثل الطالب والمعلم) */}
        <Outlet />
      </main>
    </div>
  );
}

export default MainLayout;