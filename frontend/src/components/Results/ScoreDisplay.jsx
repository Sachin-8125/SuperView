import React from 'react';

function ScoreDisplay({ finalScore, readinessLevel }) {
  const getReadinessBadge = () => {
    switch (readinessLevel) {
      case 'READY':
        return '✅ INTERVIEW READY';
      case 'MODERATE':
        return '⚠️ MODERATE';
      case 'NEEDS_IMPROVEMENT':
        return '❌ NEEDS IMPROVEMENT';
      default:
        return 'UNKNOWN';
    }
  };

  return (
    <div className="score-display">
      <div className={`score-circle ${readinessLevel.toLowerCase()}`}>
        <div className="score-number">{finalScore}</div>
        <div className="score-label">Overall Score</div>
      </div>

      <div className="readiness-badge">
        <span className={`badge ${readinessLevel.toLowerCase()}`}>
          {getReadinessBadge()}
        </span>
      </div>
    </div>
  );
}

export default ScoreDisplay;