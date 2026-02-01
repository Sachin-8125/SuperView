import React from 'react';

function QuestionBox({ question, questionNumber }) {
  return (
    <div className="question-box">
      <h2>Question {questionNumber}</h2>
      <p className="question">{question}</p>
    </div>
  );
}

export default QuestionBox;