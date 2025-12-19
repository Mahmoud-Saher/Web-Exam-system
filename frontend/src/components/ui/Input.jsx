// src/components/ui/Input.jsx
import React from 'react';
import styles from './Input.module.css'; // 1. سننشئ هذا الملف

function Input({ type = 'text', className = '', ...props }) {
  return (
    <input
      type={type}
      // 2. ندمج الكلاس الأساسي مع أي كلاس إضافي
      className={`${styles.input} ${className}`}
      {...props}
    />
  );
}

export default Input;