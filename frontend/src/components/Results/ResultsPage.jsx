import React from 'react';
import ScoreDisplay from './ScoreDisplay';
import PerformanceBreakdown from './PerformanceBreakdown';
import DetailedFeedback from './DetailedFeedback';

function ResultsPage({ results, onReset }) {
  if (!results) {
    return <div>Loading results...</div>;
  }

  return (
    <div className="results-stage">
      <div className="results-card">
        <h2>Interview Results</h2>

        <ScoreDisplay
          finalScore={results.finalScore}
          readinessLevel={results.readinessLevel}
        />

        <PerformanceBreakdown
          questionsAttempted={results.questionsAttempted}
          readinessLevel={results.readinessLevel}
          strengths={results.strengths}
          weaknesses={results.weaknesses}
          recommendations={results.recommendations}
        />

        <DetailedFeedback answers={results.answers} />

        <button className="btn btn-primary" onClick={onReset}>
          Start New Interview
        </button>
      </div>
    </div>
  );
}

export default ResultsPage;