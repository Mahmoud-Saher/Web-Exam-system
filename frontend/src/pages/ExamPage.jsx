

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios'; 
import styles from './ExamPage.module.css';

import Card from '../components/ui/Card';
import Button from '../components/ui/Button';

function ExamPage() {
  const { examId } = useParams();
  const navigate = useNavigate();
  
  const [exam, setExam] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({}); 
  const [timeLeft, setTimeLeft] = useState(null); 
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    const fetchExam = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/api/exams/${examId}`);
        const examData = response.data;

        if (!examData) {
          throw new Error("Exam data is empty");
        }

        setExam(examData);
        setTimeLeft(examData.timeLimit * 60);

      } catch (error) {
        console.error("Error fetching exam:", error);
        alert('Exam not found or server error!');
        navigate('/student');
      }
    };

    fetchExam();
  }, [examId, navigate]);

  useEffect(() => {
    if (timeLeft === null || isSubmitted) return;

    const timerId = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 0) {
          clearInterval(timerId);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timerId);
  }, [timeLeft, isSubmitted]); 

  useEffect(() => {
    if (timeLeft === 0 && !isSubmitted) {
      handleSubmit();
    }
  }, [timeLeft, isSubmitted]); 


  const handleAnswerSelect = (questionId, optionIndex) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: optionIndex,
    }));
  };

  const handleSubmit = async () => {
    if (isSubmitted) return;
    setIsSubmitted(true);

    try {
      const user = JSON.parse(localStorage.getItem('user'));
      const submissionData = {
        userId: user.id,
        examId: exam.id,
        answers: answers 
      };

      const response = await axios.post('http://localhost:3001/api/submissions', submissionData);

      navigate('/results', { state: response.data });

    } catch (error) {
      console.error("Error submitting exam:", error);
      alert('Error submitting exam. Please try again.');
      setIsSubmitted(false); 
    }
  };
  if (!exam) return <div className="p-10 text-center">Loading Exam Data...</div>;

  const questionsList = exam.Questions || exam.questions || [];
  
  if (questionsList.length === 0) {
    return <div className="p-10 text-center">This exam has no questions yet!</div>;
  }
  
  const currentQuestion = questionsList[currentQuestionIndex];
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  return (
    <div className={styles.pageContainer}>
      <Card className={styles.examCard}>
        <div className={styles.examHeader}>
          <h1 className={styles.examTitle}>{exam.title}</h1>
          <div className={`${styles.timer} ${timeLeft < 60 ? styles.timerDanger : ''}`}>
            Time Left: {minutes}:{seconds < 10 ? `0${seconds}` : seconds}
          </div>
        </div>

        <div>
          <h2 className={styles.questionHeader}>
            Question {currentQuestionIndex + 1} of {questionsList.length}
          </h2>
          <p className={styles.questionText}>{currentQuestion.text}</p>

          <div className={styles.optionsContainer}>
            {/* تأكدنا في الباك اند ان options متخزنة كـ JSON */}
            {currentQuestion.options && currentQuestion.options.map((option, index) => {
              const isSelected = answers[currentQuestion.id] === index;
              return (
                <label 
                  key={index} 
                  className={`${styles.optionLabel} ${isSelected ? styles.selectedOption : ''}`}
                >
                  <input
                    type="radio"
                    name={currentQuestion.id}
                    className={styles.optionInput}
                    checked={isSelected}
                    onChange={() => handleAnswerSelect(currentQuestion.id, index)}
                  />
                  {option}
                </label>
              );
            })}
          </div>
        </div>

        <div className={styles.navigation}>
          <Button
            variant="secondary"
            onClick={() => setCurrentQuestionIndex((prev) => prev - 1)}
            disabled={currentQuestionIndex === 0}
          >
            Previous
          </Button>

          {currentQuestionIndex === questionsList.length - 1 ? (
            <Button variant="primary" onClick={handleSubmit}>
              Submit Exam
            </Button>
          ) : (
            <Button
              variant="primary"
              onClick={() => setCurrentQuestionIndex((prev) => prev + 1)}
            >
              Next
            </Button>
          )}
        </div>
      </Card>
    </div>
  );
}

export default ExamPage;
