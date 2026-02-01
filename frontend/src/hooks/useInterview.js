import { useState, useCallback } from 'react';
import interviewAPI from '../services/api';
import { getErrorMessage } from '../utils/helpers';

export const useInterview = () => {
  const [state, setState] = useState({
    sessionId: null,
    currentQuestion: '',
    questionNumber: 0,
    totalQuestions: 8,
    difficulty: 'easy',
    timeLimit: 60,
    averageScore: 0,
    isLoading: false,
    error: null,
    results: null,
    isComplete: false
  });

  const startInterview = useCallback(async (resume, jobDescription) => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    try {
      const response = await interviewAPI.startInterview(resume, jobDescription);
      setState(prev => ({
        ...prev,
        sessionId: response.sessionId,
        currentQuestion: response.question,
        questionNumber: response.questionNumber,
        totalQuestions: response.totalQuestions,
        difficulty: response.difficulty,
        timeLimit: response.timeLimit,
        isLoading: false
      }));
      return response;
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      setState(prev => ({ ...prev, error: errorMessage, isLoading: false }));
      throw error;
    }
  }, []);

  const submitAnswer = useCallback(async (answer, timeSpent) => {
    if (!state.sessionId) {
      throw new Error('No active interview session');
    }

    setState(prev => ({ ...prev, isLoading: true, error: null }));
    try {
      const response = await interviewAPI.submitAnswer(state.sessionId, answer, timeSpent);

      if (response.complete) {
        setState(prev => ({
          ...prev,
          isComplete: true,
          results: response,
          isLoading: false
        }));
      } else if (response.terminated) {
        setState(prev => ({
          ...prev,
          isComplete: true,
          results: response,
          isLoading: false
        }));
      } else {
        setState(prev => ({
          ...prev,
          currentQuestion: response.nextQuestion,
          questionNumber: response.questionNumber,
          difficulty: response.difficulty,
          timeLimit: response.timeLimit,
          averageScore: response.averageScore,
          isLoading: false
        }));
      }
      return response;
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      setState(prev => ({ ...prev, error: errorMessage, isLoading: false }));
      throw error;
    }
  }, [state.sessionId]);

  const reset = useCallback(() => {
    setState({
      sessionId: null,
      currentQuestion: '',
      questionNumber: 0,
      totalQuestions: 8,
      difficulty: 'easy',
      timeLimit: 60,
      averageScore: 0,
      isLoading: false,
      error: null,
      results: null,
      isComplete: false
    });
  }, []);

  return {
    ...state,
    startInterview,
    submitAnswer,
    reset
  };
};