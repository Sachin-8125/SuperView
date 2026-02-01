export const formatTime = (seconds) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

export const calculateScoreColor = (score) => {
  if (score >= 70) return '#22c55e';
  if (score >= 50) return '#f59e0b';
  return '#ef4444';
};

export const getReadinessEmoji = (level) => {
  switch (level) {
    case 'READY':
      return '✅';
    case 'MODERATE':
      return '⚠️';
    case 'NEEDS_IMPROVEMENT':
      return '❌';
    default:
      return '❓';
  }
};

export const truncateText = (text, length = 100) => {
  if (!text) return '';
  return text.length > length ? text.substring(0, length) + '...' : text;
};

export const validateResume = (resume) => {
  if (!resume || resume.trim().length === 0) {
    return { valid: false, error: 'Resume cannot be empty' };
  }
  if (resume.length < 50) {
    return { valid: false, error: 'Resume should contain more details' };
  }
  return { valid: true };
};

export const validateJD = (jd) => {
  if (!jd || jd.trim().length === 0) {
    return { valid: false, error: 'Job Description cannot be empty' };
  }
  if (jd.length < 50) {
    return { valid: false, error: 'Job Description should contain more details' };
  }
  return { valid: true };
};

export const getErrorMessage = (error) => {
  if (error?.response?.status === 404) {
    return 'Resource not found. Please try starting a new interview.';
  }
  if (error?.response?.status === 400) {
    return error.response.data.error || 'Invalid request. Please check your input.';
  }
  if (error?.response?.status === 503) {
    return 'AI service is temporarily unavailable. Please try again later.';
  }
  if (error?.message === 'Network Error') {
    return 'Network error. Please check your connection.';
  }
  return 'Something went wrong. Please try again.';
};