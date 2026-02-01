import React, { useState, useRef } from 'react';
import { validateResume, validateJD } from '../../utils/helpers';
import { readResumeFile, RESUME_ACCEPT } from '../../utils/fileResumeReader';

function InputStage({ onStart, isLoading }) {
  const [resume, setResume] = useState('');
  const [jd, setJD] = useState('');
  const [error, setError] = useState('');
  const [resumeFileName, setResumeFileName] = useState('');
  const [fileLoading, setFileLoading] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError('');
    setFileLoading(true);
    const result = await readResumeFile(file);
    setFileLoading(false);

    if (result.error) {
      setError(result.error);
      setResumeFileName('');
      return;
    }
    setResume(result.text);
    setResumeFileName(file.name);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleClearResume = () => {
    setResumeFileName('');
    setResume('');
    if (fileInputRef.current) fileInputRef.current.value = '';
    setError('');
  };

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
          <div className="resume-upload-row">
            <label className="file-upload-label">
              <input
                ref={fileInputRef}
                type="file"
                accept={RESUME_ACCEPT}
                onChange={handleFileChange}
                disabled={isLoading || fileLoading}
                className="file-upload-input"
              />
              <span className="btn btn-outline">
                {fileLoading ? 'Reading file...' : 'Upload Resume File'}
              </span>
            </label>
            {resumeFileName && (
              <span className="resume-file-name">
                {resumeFileName}
                <button type="button" className="clear-file-btn" onClick={handleClearResume} aria-label="Clear file">×</button>
              </span>
            )}
          </div>
          <p className="input-hint">or paste your resume below</p>
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