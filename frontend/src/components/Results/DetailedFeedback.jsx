import React from 'react';

function DetailedFeedback({ answers }) {
  if (!answers || answers.length === 0) {
    return null;
  }

  return (
    <div className="answer-details">
      <h3>📝 Detailed Answers</h3>
      {answers.map((a, i) => (
        <div key={i} className="answer-item">
          <div className="answer-header">
            <strong>Q{a.questionNumber}: {a.question.substring(0, 60)}...</strong>
            <span
              className={`score-badge ${
                a.score >= 70 ? 'good' : a.score >= 50 ? 'okay' : 'poor'
              }`}
            >
              {a.score}/100
            </span>
          </div>
          <p className="answer-text">Your answer: {a.answer.substring(0, 150)}...</p>
          <p className="feedback">💬 Feedback: {a.feedback}</p>
        </div>
      ))}
    </div>
  );
}

export default DetailedFeedback;