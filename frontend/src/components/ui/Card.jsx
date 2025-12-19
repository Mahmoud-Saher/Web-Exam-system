// src/components/ui/Card.jsx
import React from 'react';
import styles from './Card.module.css'; // 1. سننشئ هذا الملف

function Card({ children, className = '' }) {
  return (
    // 2. ندمج الكلاس الأساسي مع أي كلاس إضافي
    <div className={`${styles.card} ${className}`}>
      {children}
    </div>
  );
}

export default Card;