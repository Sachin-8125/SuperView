import React from 'react';

function AnswerInput({ answer, setAnswer, onSubmit, isLoading, disabled }) {
  return (
    <div className="answer-section">
      <div className="answer-input-group">
        <textarea
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          placeholder="Type your answer here..."
          rows="6"
          disabled={isLoading}
        />
      </div>

      <button
        className="btn btn-primary btn-submit"
        onClick={onSubmit}
        disabled={disabled || isLoading}
      >
        {isLoading ? 'Submitting...' : 'Submit Answer →'}
      </button>
    </div>
  );
}

export default AnswerInput;