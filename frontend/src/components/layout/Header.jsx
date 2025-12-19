// src/components/layout/Header.jsx

import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from './Header.module.css';
import Button from '../ui/Button'; // استيراد الزر الخاص بنا

function Header() {
  const navigate = useNavigate();

  const handleLogout = () => {
    // هنا سنقوم بمسح بيانات المستخدم من (localStorage) لاحقاً
    console.log("You have logged out");
    // إعادة توجيه المستخدم لصفحة اللوجن
    navigate('/login');
  };

  return (
    <nav className={styles.navbar}>
      <div className={styles.container}>
        <Link to="/" className={styles.brand}>
          Online Exam System
        </Link>
        
        <div className={styles.userInfo}>
          {/* سنضع اسم المستخدم هنا لاحقاً */}
          <span className={styles.welcome}>Welcome</span>
          
          <Button onClick={handleLogout} variant="secondary">
        Logout
          </Button>
        </div>
      </div>
    </nav>
  );
}

export default Header;