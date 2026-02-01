export const DIFFICULTY_LEVELS = {
  EASY: 'easy',
  MEDIUM: 'medium',
  HARD: 'hard'
};

export const READINESS_LEVELS = {
  READY: 'READY',
  MODERATE: 'MODERATE',
  NEEDS_IMPROVEMENT: 'NEEDS_IMPROVEMENT'
};

export const READINESS_COLORS = {
  READY: '#22c55e',
  MODERATE: '#f59e0b',
  NEEDS_IMPROVEMENT: '#ef4444'
};

export const INTERVIEW_CONFIG = {
  MAX_QUESTIONS: 8,
  DEFAULT_TIME_LIMIT: 60,
  MIN_ANSWER_LENGTH: 5,
  SESSION_STORAGE_KEY: 'interview_session'
};

export const API_ERRORS = {
  SESSION_NOT_FOUND: 'Interview session not found',
  NETWORK_ERROR: 'Network error. Please check your connection.',
  VALIDATION_ERROR: 'Please check your input and try again.',
  SERVER_ERROR: 'Server error. Please try again later.'
};