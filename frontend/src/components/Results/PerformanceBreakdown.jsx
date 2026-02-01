import React from 'react';

function PerformanceBreakdown({
  questionsAttempted,
  readinessLevel,
  strengths,
  weaknesses,
  recommendations
}) {
  const getRecommendationText = () => {
    if (readinessLevel === 'READY') {
      return 'You are well-prepared for this role!';
    } else if (readinessLevel === 'MODERATE') {
      return 'With some practice, you can improve your readiness.';
    } else {
      return 'Focus on fundamentals and technical knowledge.';
    }
  };

  return (
    <div className="results-grid">
      <div className="result-section">
        <h3>📊 Performance Summary</h3>
        <p><strong>Questions Attempted:</strong> {questionsAttempted}/8</p>
        <p><strong>Readiness Level:</strong> {readinessLevel}</p>
        <p><strong>Recommendation:</strong> {getRecommendationText()}</p>
      </div>

      {strengths && strengths.length > 0 && (
        <div className="result-section">
          <h3>💪 Strengths</h3>
          <ul>
            {strengths.map((s, i) => (
              <li key={i}>✓ {s}</li>
            ))}
          </ul>
        </div>
      )}

      {weaknesses && weaknesses.length > 0 && (
        <div className="result-section">
          <h3>📈 Areas to Improve</h3>
          <ul>
            {weaknesses.map((w, i) => (
              <li key={i}>• {w}</li>
            ))}
          </ul>
        </div>
      )}

      {recommendations && (
        <div className="result-section">
          <h3>💡 Recommendations</h3>
          <ul>
            {recommendations.slice(0, 3).map((r, i) => (
              <li key={i}>→ {r}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default PerformanceBreakdown;