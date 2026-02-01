import React, { useState } from 'react';
import { validateResume, validateJD } from '../../utils/helpers';

function InputStage({ onStart, isLoading }) {
  const [resume, setResume] = useState('');
  const [jd, setJD] = useState('');
  const [error, setError] = useState('');

  const handleStart = () => {
    const resumeValidation = validateResume(resume);
    const jdValidation = validateJD(jd);

    if (!resumeValidation.valid) {
      setError(resumeValidation.error);
      return;
    }
    if (!jdValidation.valid) {
      setError(jdValidation.error);
      return;
    }

    setError('');
    onStart(resume, jd);
  };

  return (
    <div className="input-stage">
      <div className="input-container">
        <div className="input-section">
          <label>Your Resume</label>
          <textarea
            value={resume}
            onChange={(e) => setResume(e.target.value)}
            placeholder="Paste your resume here... Include skills, experience, projects, and achievements"
            rows="8"
            disabled={isLoading}
          />
        </div>

        <div className="input-section">
          <label>Job Description</label>
          <textarea
            value={jd}
            onChange={(e) => setJD(e.target.value)}
            placeholder="Paste the job description here... Include role, responsibilities, required skills"
            rows="8"
            disabled={isLoading}
          />
        </div>

        {error && <div className="error-message">{error}</div>}

        <button
          className="btn btn-primary"
          onClick={handleStart}
          disabled={isLoading || !resume.trim() || !jd.trim()}
        >
          {isLoading ? 'Starting Interview...' : 'Start Mock Interview →'}
        </button>
      </div>
    </div>
  );
}

export default InputStage;