// src/components/instructor/QuestionBank.jsx

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import * as XLSX from 'xlsx';
import { FaTrash } from 'react-icons/fa'; // أيقونة الحذف
import styles from './QuestionBank.module.css';

import Card from '../ui/Card';
import Input from '../ui/Input';
import Button from '../ui/Button';

function QuestionBank() {
  const [questions, setQuestions] = useState([]);
  
  // States للفورم اليدوي
  const [questionText, setQuestionText] = useState('');
  const [options, setOptions] = useState(['', '', '', '']);
  const [correctAnswer, setCorrectAnswer] = useState(0);

  // جلب بيانات المستخدم
  const user = JSON.parse(localStorage.getItem('user'));
  const userId = user ? user.id : null;

  // 1. دالة الجلب
  const fetchQuestions = async () => {
    try {
      const response = await axios.get(`http://localhost:3001/api/questions?userId=${userId}`);
      setQuestions(response.data);
    } catch (error) {
      console.error("Error fetching questions:", error);
    }
  };

  // 2. تفعيل الجلب عند التحميل
  useEffect(() => {
    if (userId) fetchQuestions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  // 3. دالة حذف سؤال (الجديدة)
  const handleDeleteQuestion = async (qId) => {
    if (!window.confirm("Are you sure you want to delete this question?")) return;
    
    try {
      await axios.delete(`http://localhost:3001/api/questions/${qId}`);
      // تحديث القائمة بحذف السؤال محلياً
      setQuestions(questions.filter(q => q.id !== qId)); 
    } catch (error) {
      console.error(error);
      alert("Failed to delete question");
    }
  };

  // 4. دالة رفع ملف Excel
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    
    reader.onload = async (evt) => {
      const bstr = evt.target.result;
      const wb = XLSX.read(bstr, { type: 'binary' });
      const wsname = wb.SheetNames[0];
      const ws = wb.Sheets[wsname];
      const data = XLSX.utils.sheet_to_json(ws, { header: 1 });
      
      const formattedQuestions = [];

      for (let i = 1; i < data.length; i++) {
        const row = data[i];
        if (row.length > 0) {
          formattedQuestions.push({
            text: row[0],
            options: [row[1], row[2], row[3], row[4]],
            correctAnswerIndex: Number(row[5])
          });
        }
      }

      if (formattedQuestions.length === 0) {
        alert("File is empty or format is wrong!");
        return;
      }

      try {
        await axios.post('http://localhost:3001/api/questions/bulk', {
          questions: formattedQuestions,
          userId: userId
        });
        
        alert(`Successfully imported ${formattedQuestions.length} questions!`);
        fetchQuestions();
      } catch (error) {
        console.error("Error uploading excel:", error);
        alert("Failed to upload questions.");
      }
    };

    reader.readAsBinaryString(file);
  };

  // 5. دالة الإضافة اليدوية
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const newQuestionData = {
        text: questionText,
        options: options,
        correctAnswerIndex: Number(correctAnswer),
        userId: userId 
      };
      await axios.post('http://localhost:3001/api/questions', newQuestionData);
      
      fetchQuestions();

      setQuestionText('');
      setOptions(['', '', '', '']);
      setCorrectAnswer(0);
      alert('Question added successfully!');
    } catch (error) {
      console.error("Error adding question:", error);
      alert('Failed to add question');
    }
  };

  const handleOptionChange = (index, value) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  return (
    <div className={styles.gridContainer}>
      
      {/* العمود الأول: الفورم */}
      <Card className={styles.formCard}>
        <h3>Add Questions</h3>
        
        <div style={{ marginBottom: '2rem', padding: '1rem', border: '2px dashed #ccc', borderRadius: '8px', textAlign: 'center' }}>
          <p style={{marginBottom: '0.5rem', fontWeight: 'bold'}}>Import from Excel</p>
          <input 
            type="file" 
            accept=".xlsx, .xls" 
            onChange={handleFileUpload} 
            style={{ display: 'block', margin: '0 auto' }}
          />
          <p style={{fontSize: '0.8rem', color: '#666', marginTop: '5px'}}>
            Format: Question | Opt1 | Opt2 | Opt3 | Opt4 | CorrectIndex(0-3)
          </p>
        </div>
        
        <hr style={{margin: '1rem 0'}} />

        <h3>Or Add Manually</h3>
        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label className={styles.label}>Question Text</label>
            <Input
              placeholder="What is 2+2?"
              value={questionText}
              onChange={(e) => setQuestionText(e.target.value)}
              required
            />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.label}>Options</label>
            <div className={styles.optionsGrid}>
              {options.map((opt, index) => (
                <Input
                  key={index}
                  placeholder={`Option ${index + 1}`}
                  value={opt}
                  onChange={(e) => handleOptionChange(index, e.target.value)}
                  required
                />
              ))}
            </div>
          </div>
          <div className={styles.formGroup}>
            <label className={styles.label}>Correct Answer</label>
            <select
              value={correctAnswer}
              onChange={(e) => setCorrectAnswer(e.target.value)}
              className={styles.select}
              style={{ padding: '10px', border: '1px solid #ccc', borderRadius: '5px' }}
            >
              {options.map((_, index) => (
                <option key={index} value={index}>Option {index + 1}</option>
              ))}
            </select>
          </div>
          <Button type="submit" variant="primary">Save Question</Button>
        </form>
      </Card>

      {/* العمود الثاني: قائمة الأسئلة */}
      <Card className={styles.bankContainer}>
        <h3>Your Question Bank ({questions.length})</h3>
        <div className={styles.questionList}>
          {questions.length === 0 && <p>No questions found in database.</p>}
          {questions.map((q) => (
            <div key={q.id} className={styles.questionItem} style={{position: 'relative'}}>
              
              {/* زر الحذف */}
              <button 
                onClick={() => handleDeleteQuestion(q.id)}
                style={{
                  position: 'absolute', right: '10px', top: '10px', 
                  background: 'none', border: 'none', color: '#dc2626', cursor: 'pointer', fontSize: '1rem'
                }}
                title="Delete Question"
              >
                <FaTrash />
              </button>

              <p className={styles.questionText} style={{paddingRight: '20px'}}>{q.text}</p>
              <ul>
                {q.options.map((opt, i) => (
                  <li key={i} className={i === q.correctAnswerIndex ? styles.correctOption : ''}>
                    {opt}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

export default QuestionBank;