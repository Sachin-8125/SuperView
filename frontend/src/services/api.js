import axios from 'axios';

const API_BASE = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json'
  }
});

api.interceptors.request.use(
  config => {
    console.log(`[API] ${config.method.toUpperCase()} ${config.url}`);
    return config;
  },
  error => Promise.reject(error)
);

api.interceptors.response.use(
  response => {
    console.log(`[API] Response:`, response.status);
    return response.data;
  },
  error => {
    console.error('[API] Error:', error.response?.status, error.response?.data);
    return Promise.reject(error);
  }
);

const interviewAPI = {
  startInterview: (resume, jobDescription) =>
    api.post('/interview/start', {
      resume,
      jobDescription
    }),

  submitAnswer: (sessionId, answer, timeSpent) =>
    api.post('/interview/answer', {
      sessionId,
      answer,
      timeSpent
    }),

  getResults: (sessionId) =>
    api.get(`/results/${sessionId}`)
};

export default interviewAPI;