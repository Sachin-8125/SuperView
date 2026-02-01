const aiService = require('./aiService');

const scoringService = {
  async scoreAnswer(question, answer, expectedKeywords, timeSpent, maxTime) {
    const prompt = `Score this interview answer on a 0-100 scale.

Question: "${question}"
Answer: "${answer}"
Expected Keywords: ${expectedKeywords.join(', ') || 'general assessment'}
Time Spent: ${timeSpent}s / ${maxTime}s allowed

Evaluate on these criteria:
1. Accuracy (0-25): Correctness and relevance
2. Clarity (0-25): How well explained
3. Depth (0-25): Detail and comprehensiveness
4. Completeness (0-15): Covered all aspects
5. Time Efficiency (0-10): Penalty if exceeded time

Respond with ONLY this JSON:
{
  "accuracy_score": <0-25>,
  "clarity_score": <0-25>,
  "depth_score": <0-25>,
  "completeness_score": <0-15>,
  "time_score": <0-10>,
  "total_score": <0-100>,
  "feedback": "brief feedback",
  "keywords_found": ["keyword1"]
}`;

    const response = await aiService.callClaude(prompt, 600);
    const parsed = await aiService.parseJSON(response);

    if (!parsed) {
      return {
        accuracy_score: 50,
        clarity_score: 50,
        depth_score: 50,
        completeness_score: 30,
        time_score: 10,
        total_score: 50,
        feedback: 'Unable to parse scoring response',
        keywords_found: []
      };
    }

    return parsed;
  },

  calculateAdaptiveDifficulty(currentScore, currentDifficulty, questionNumber) {
    let newDifficulty = currentDifficulty;

    if (currentScore >= 75 && currentDifficulty === 'easy') {
      newDifficulty = 'medium';
    } else if (currentScore >= 75 && currentDifficulty === 'medium') {
      newDifficulty = 'hard';
    } else if (currentScore < 40 && currentDifficulty === 'hard') {
      newDifficulty = 'medium';
    } else if (currentScore < 40 && currentDifficulty === 'medium' && questionNumber > 3) {
      newDifficulty = 'easy';
    }

    return newDifficulty;
  },

  calculateReadinessLevel(averageScore) {
    if (averageScore >= 70) return 'READY';
    if (averageScore >= 50) return 'MODERATE';
    return 'NEEDS_IMPROVEMENT';
  },

  shouldTerminateEarly(averageScore, questionsAttempted, minThreshold, terminationAfter) {
    return averageScore < minThreshold && questionsAttempted > terminationAfter;
  }
};

module.exports = scoringService;