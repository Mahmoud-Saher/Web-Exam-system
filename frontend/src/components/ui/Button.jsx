// src/components/ui/Button.jsx
import React from 'react';
import styles from './Button.module.css'; // 1. سننشئ هذا الملف

function Button({ children, onClick, className = '', variant = 'primary', ...props }) {
  
  // 2. سنستخدم الكلاسات من ملف الـ CSS
  const variantClass = styles[variant]; // (مثل: styles.primary)

  return (
    <button
      onClick={onClick}
      // 3. ندمج الكلاسات: الأساسي + المتغير + أي كلاس إضافي
      className={`${styles.buttonBase} ${variantClass} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

export default Button;