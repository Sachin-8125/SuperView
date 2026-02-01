import React, { useState, useEffect } from 'react';
import QuestionBox from './QuestionBox';
import AnswerInput from './AnswerInput';
import Timer from './Timer';

function InterviewStage({
  question,
  questionNumber,
  totalQuestions,
  difficulty,
  timeLimit,
  averageScore,
  onSubmit,
  isLoading,
  error
}) {
  const [answer, setAnswer] = useState('');
  const [timeSpent, setTimeSpent] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(timeLimit);

  useEffect(() => {
    setAnswer('');
    setTimeSpent(0);
    setTimeRemaining(timeLimit);
  }, [question, timeLimit]);

  const handleSubmit = () => {
    onSubmit(answer, timeSpent);
  };

  return (
    <div className="interview-stage">
      <div className="interview-header">
        <div className="progress">
          <span>Question {questionNumber}/{totalQuestions}</span>
          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{ width: `${(questionNumber / totalQuestions) * 100}%` }}
            ></div>
          </div>
        </div>

        <div className="stats">
          <span className="stat">
            <strong>Difficulty:</strong> {difficulty.toUpperCase()}
          </span>
          <span className="stat">
            <strong>Avg Score:</strong> {averageScore}/100
          </span>
          <Timer timeRemaining={timeRemaining} timeLimit={timeLimit} onUpdate={setTimeSpent} />
        </div>
      </div>

      <QuestionBox question={question} questionNumber={questionNumber} />

      <AnswerInput
        answer={answer}
        setAnswer={setAnswer}
        onSubmit={handleSubmit}
        isLoading={isLoading}
        disabled={!answer.trim()}
      />

      {error && <div className="error-message">{error}</div>}
    </div>
  );
}

export default InterviewStage;