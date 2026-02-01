const { v4: uuidv4 } = require('uuid');
const { db } = require('../config/database');
const { config } = require('../config/env');
const aiService = require('../services/aiService');
const resumeParser = require('../services/resumeParser');
const jdAnalyzer = require('../services/jdAnalyzer');
const scoringService = require('../services/scoringService');

async function generateQuestion(resumeData, jdData, difficulty, questionNumber, previousAnswers) {
  const answerSummary = previousAnswers.slice(-2).map((a, i) => 
    `Q${questionNumber - 2 + i}: Score ${a.score}/100`
  ).join('\n');

  const prompt = `You are a professional tech interviewer. Generate ONE interview question for a ${difficulty.toUpperCase()} level.

Resume Skills: ${(resumeData.skills || []).slice(0, 5).join(', ')}
JD Required Skills: ${(jdData.required_skills || []).slice(0, 5).join(', ')}
${answerSummary ? `Recent Performance:\n${answerSummary}` : ''}

Difficulty Guidelines:
- EASY: Definitions, basic concepts, simple scenarios (30-50 words)
- MEDIUM: Real-world application, trade-offs, problem solving (40-70 words)
- HARD: Complex system design, optimization, edge cases (50-80 words)

Types: Mix of technical, behavioral, and scenario-based

Return ONLY this JSON:
{
  "question": "specific question text",
  "type": "technical|behavioral|scenario",
  "expected_keywords": ["keyword1", "keyword2"],
  "ideal_duration_seconds": <60 to 120>
}`;

  const response = await aiService.callClaude(prompt, 500);
  const parsed = await aiService.parseJSON(response);

  if (!parsed) {
    return {
      question: 'Describe your approach to solving complex problems',
      type: 'behavioral',
      expected_keywords: ['structured', 'systematic'],
      ideal_duration_seconds: 60
    };
  }

  return parsed;
}

const interviewController = {
  async startInterview(req, res, next) {
    try {
      const { resume, jobDescription } = req.body;

      if (!resume || !jobDescription) {
        return res.status(400).json({ 
          error: 'Resume and Job Description are required' 
        });
      }

      // Parse resume and analyze JD
      const resumeData = await resumeParser.parse(resume);
      const jdData = await jdAnalyzer.analyze(jobDescription);

      // Create session
      const sessionId = uuidv4();
      const session = {
        sessionId,
        resumeData,
        jdData,
        answers: [],
        currentDifficulty: 'easy',
        score: 0,
        questionCount: 0,
        maxQuestions: config.maxQuestions,
        terminated: false,
        terminationReason: null,
        startTime: Date.now()
      };

      // Generate first question
      const firstQuestion = await generateQuestion(
        resumeData,
        jdData,
        'easy',
        1,
        []
      );

      session.lastQuestion = firstQuestion.question;
      session.lastKeywords = firstQuestion.expected_keywords;
      session.lastMaxTime = firstQuestion.ideal_duration_seconds;

      db.saveSession(sessionId, session);

      res.json({
        sessionId,
        question: firstQuestion.question,
        questionNumber: 1,
        difficulty: 'easy',
        timeLimit: firstQuestion.ideal_duration_seconds,
        totalQuestions: config.maxQuestions,
        message: 'Interview started successfully'
      });
    } catch (error) {
      next(error);
    }
  },

  async submitAnswer(req, res, next) {
    try {
      const { sessionId, answer, timeSpent } = req.body;

      if (!sessionId || !answer) {
        return res.status(400).json({ error: 'Session ID and answer are required' });
      }

      const session = db.getSession(sessionId);
      if (!session) {
        return res.status(404).json({ error: 'Interview session not found' });
      }

      if (session.terminated) {
        return res.status(400).json({ 
          error: 'Interview already terminated',
          reason: session.terminationReason
        });
      }

      // Score the answer
      const scoreData = await scoringService.scoreAnswer(
        session.lastQuestion,
        answer,
        session.lastKeywords,
        timeSpent,
        session.lastMaxTime
      );

      // Store answer
      const answerRecord = {
        questionNumber: session.questionCount + 1,
        question: session.lastQuestion,
        answer,
        score: scoreData.total_score,
        timeSpent,
        feedback: scoreData.feedback,
        breakdown: {
          accuracy: scoreData.accuracy_score,
          clarity: scoreData.clarity_score,
          depth: scoreData.depth_score,
          completeness: scoreData.completeness_score,
          timeEfficiency: scoreData.time_score
        }
      };

      db.saveAnswer(sessionId, answerRecord);

      session.answers.push(answerRecord);
      session.score += scoreData.total_score;
      session.questionCount += 1;

      // Calculate average score
      const averageScore = Math.round(session.score / session.questionCount);

      // Check for early termination
      if (scoringService.shouldTerminateEarly(
        averageScore,
        session.questionCount,
        config.minPerformanceThreshold,
        config.earlyTerminationAfter
      )) {
        session.terminated = true;
        session.terminationReason = 'Performance below threshold';
        db.updateSession(sessionId, session);

        return res.json({
          terminated: true,
          reason: 'Performance below threshold',
          averageScore,
          questionsAttempted: session.questionCount
        });
      }

      // Check if interview complete
      if (session.questionCount >= config.maxQuestions) {
        const finalScore = averageScore;
        const readinessLevel = scoringService.calculateReadinessLevel(finalScore);

        session.terminated = true;
        session.terminationReason = 'Interview completed';
        session.finalScore = finalScore;
        session.readinessLevel = readinessLevel;
        db.updateSession(sessionId, session);

        return res.json({
          complete: true,
          finalScore,
          readinessLevel,
          questionsAttempted: session.questionCount,
          message: 'Interview completed'
        });
      }

      // Adapt difficulty
      const newDifficulty = scoringService.calculateAdaptiveDifficulty(
        scoreData.total_score,
        session.currentDifficulty,
        session.questionCount
      );
      session.currentDifficulty = newDifficulty;

      // Generate next question
      const nextQuestion = await generateQuestion(
        session.resumeData,
        session.jdData,
        newDifficulty,
        session.questionCount + 1,
        session.answers
      );

      session.lastQuestion = nextQuestion.question;
      session.lastKeywords = nextQuestion.expected_keywords;
      session.lastMaxTime = nextQuestion.ideal_duration_seconds;

      db.updateSession(sessionId, session);

      res.json({
        success: true,
        feedback: scoreData.feedback,
        score: scoreData.total_score,
        breakdown: answerRecord.breakdown,
        nextQuestion: nextQuestion.question,
        questionNumber: session.questionCount + 1,
        difficulty: newDifficulty,
        timeLimit: nextQuestion.ideal_duration_seconds,
        averageScore,
        totalQuestionsRemaining: config.maxQuestions - session.questionCount
      });
    } catch (error) {
      next(error);
    }
  }
};

module.exports = interviewController;