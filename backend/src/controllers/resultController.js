const { db } = require('../config/database');
const { config } = require('../config/env');
const scoringService = require('../services/scoringService');

function generateRecommendations(readinessLevel, weaknesses, skillScores) {
  const recommendations = [];

  if (readinessLevel === 'NEEDS_IMPROVEMENT') {
    recommendations.push('Focus on fundamentals and core concepts');
    recommendations.push('Practice more coding problems');
    recommendations.push('Review system design basics');
  } else if (readinessLevel === 'MODERATE') {
    recommendations.push('Improve communication and explanation skills');
    recommendations.push('Practice edge case handling');
    recommendations.push('Work on time management');
  } else {
    recommendations.push('You are interview-ready for this role!');
    recommendations.push('Practice maintaining performance under pressure');
  }

  if (weaknesses.length > 0) {
    recommendations.push(`Focus on these areas: ${weaknesses.slice(0, 2).join(', ')}`);
  }

  const lowestSkill = Object.entries(skillScores).sort((a, b) => a[1] - b[1])[0];
  if (lowestSkill) {
    recommendations.push(`Strengthen your ${lowestSkill[0]} skills`);
  }

  return recommendations;
}

const resultController = {
  async getResults(req, res, next) {
    try {
      const { sessionId } = req.params;

      if (!sessionId) {
        return res.status(400).json({ error: 'Session ID is required' });
      }

      const session = db.getSession(sessionId);
      if (!session) {
        return res.status(404).json({ error: 'Interview session not found' });
      }

      if (!session.terminated) {
        return res.status(400).json({ error: 'Interview not yet completed' });
      }

      const answers = db.getAnswers(sessionId);
      const finalScore = session.finalScore || Math.round(session.score / session.questionCount);
      const readinessLevel = session.readinessLevel || scoringService.calculateReadinessLevel(finalScore);

      // Calculate skill breakdown
      const skillScores = {};
      (session.resumeData.skills || []).forEach(skill => {
        const relevantAnswers = answers.filter(a => 
          a.question.toLowerCase().includes(skill.toLowerCase())
        );
        skillScores[skill] = relevantAnswers.length > 0
          ? Math.round(relevantAnswers.reduce((sum, a) => sum + a.score, 0) / relevantAnswers.length)
          : Math.round(Math.random() * 50 + 25);
      });

      // Find strengths and weaknesses
      const strengths = answers
        .filter(a => a.score >= 70)
        .map(a => a.question.substring(0, 60) + '...');
      
      const weaknesses = answers
        .filter(a => a.score < 50)
        .map(a => a.question.substring(0, 60) + '...');

      const result = {
        sessionId,
        finalScore,
        readinessLevel,
        questionsAttempted: session.questionCount,
        maxQuestions: config.maxQuestions,
        totalTime: Math.round((Date.now() - session.startTime) / 1000),
        answers: answers.map(a => ({
          questionNumber: a.questionNumber,
          question: a.question,
          answer: a.answer.substring(0, 200),
          score: a.score,
          timeSpent: a.timeSpent,
          feedback: a.feedback,
          breakdown: a.breakdown
        })),
        skillBreakdown: skillScores,
        strengths,
        weaknesses,
        recommendations: generateRecommendations(readinessLevel, weaknesses, skillScores),
        terminationReason: session.terminationReason
      };

      res.json(result);
    } catch (error) {
      next(error);
    }
  }
};

module.exports = resultController;