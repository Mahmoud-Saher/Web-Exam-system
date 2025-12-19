// src/pages/AuthPage.jsx

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaFacebook, FaLinkedin, FaGithub, FaGlobe } from 'react-icons/fa'; // استيراد الأيقونات

import styles from './AuthPage.module.css';

// استيراد المكونات
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';

function AuthPage() {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('student');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isLogin) {
        // --- Login ---
        const response = await axios.post('http://localhost:3001/api/auth/login', {
          email,
          password
        });
        localStorage.setItem('user', JSON.stringify(response.data.user));
        
        if (response.data.user.role === 'student') {
          navigate('/student');
        } else {
          navigate('/instructor');
        }
      } else {
        // --- Sign Up ---
        await axios.post('http://localhost:3001/api/auth/signup', {
          username,
          email,
          password,
          role
        });
        alert('Account created! Please log in.');
        setIsLogin(true);
      }
    } catch (error) {
      const msg = error.response?.data?.message || 'Something went wrong';
      alert(`Error: ${msg}`);
    }
  };

  return (
    <div className={styles.container}>
      
      {/* 1. القسم الأيسر: الفورم */}
      <div className={styles.formSection}>
        {/* div المحتوى: لازم كل حاجة تكون جواه عشان تترتب تحت بعض */}
        <div className={styles.formContent}>
          
          <div className={styles.logo}>
            Online<br /> ExamSystem
          </div>

          <h1 className={styles.heading}>
            {isLogin ? 'Welcome back' : 'Create an account'}
          </h1>
         

          <form className={styles.form} onSubmit={handleSubmit}>
            {!isLogin && (
              <Input
                type="text"
                placeholder="Full Name"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            )}
            
            <Input
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            
            <Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            {!isLogin && (
              <select 
                className={styles.selectInput}
                value={role} 
                onChange={(e) => setRole(e.target.value)}
              >
                <option value="student">Student</option>
                <option value="instructor">Instructor</option>
              </select>
            )}

            <Button type="submit" variant="primary" style={{ marginTop: '10px' }}>
              {isLogin ? 'Sign in' : 'Sign up'}
            </Button>
          </form>

           <p className={styles.toggleText}>
            {isLogin ? "Don't have an account?" : "Already have an account?"}
            <button 
              className={styles.toggleLink}
              onClick={() => setIsLogin(!isLogin)}
            >
              {isLogin ? "Sign up" : "Log in"}
            </button>
          </p> 
         
          

        </div> 
      </div> 

      {/* 2. القسم الأيمن: الصورة */}
      <div className={styles.imageSection}>
        <div className={styles.overlay}>
          <h2 className={styles.imageHeading}>
            Master your exams,<br />
            Unlock your future.
          </h2>
          <p className={styles.imageText}>
            The best platform for students and instructors to manage online assessments efficiently and securely.
          </p>
        </div>
      </div>

    </div>
  );
}

export default AuthPage;