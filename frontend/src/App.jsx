import React, { useState } from 'react';
import './App.css';
import InputStage from './components/Input/InputStage';
import InterviewStage from './components/Interview/InterviewStage';
import ResultsPage from './components/Results/ResultsPage';
import Header from './components/Common/Header';
import { useInterview } from './hooks/useInterview';

function App() {
  const [stage, setStage] = useState('input');
  const interview = useInterview();

  const handleStartInterview = async (resume, jd) => {
    try {
      await interview.startInterview(resume, jd);
      setStage('interview');
    } catch (error) {
      console.error('Failed to start interview:', error);
    }
  };

  const handleAnswerSubmit = async (answer, timeSpent) => {
    try {
      const response = await interview.submitAnswer(answer, timeSpent);
      if (response.complete || response.terminated) {
        setStage('results');
      }
    } catch (error) {
      console.error('Failed to submit answer:', error);
    }
  };

  const handleReset = () => {
    setStage('input');
    interview.reset();
  };

  return (
    <div className="app">
      <Header />
      {stage === 'input' && (
        <InputStage onStart={handleStartInterview} isLoading={interview.isLoading} />
      )}
      {stage === 'interview' && (
        <InterviewStage
          question={interview.currentQuestion}
          questionNumber={interview.questionNumber}
          totalQuestions={interview.totalQuestions}
          difficulty={interview.difficulty}
          timeLimit={interview.timeLimit}
          averageScore={interview.averageScore}
          onSubmit={handleAnswerSubmit}
          isLoading={interview.isLoading}
          error={interview.error}
        />
      )}
      {stage === 'results' && (
        <ResultsPage results={interview.results} onReset={handleReset} />
      )}
    </div>
  );
}

export default App;