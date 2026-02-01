const aiService = require('./aiService');

const jdAnalyzer = {
  async analyze(jdText) {
    if (!jdText || jdText.trim().length === 0) {
      throw new Error('Job Description text is required');
    }

    const prompt = `Analyze this job description and extract in JSON format:
- required_skills (array of must-have technical skills)
- nice_to_have_skills (array of preferred skills)
- key_responsibilities (array of main duties)
- experience_required (number of years)
- seniority_level (junior|mid|senior|lead)
- tech_stack (array of technologies mentioned)
- soft_skills (array of behavioral skills needed)

JD:
${jdText}

Return ONLY valid JSON without markdown. Use empty arrays if not specified.`;

    const response = await aiService.callClaude(prompt, 1024);
    const parsed = await aiService.parseJSON(response);

    if (!parsed) {
      return {
        required_skills: [],
        nice_to_have_skills: [],
        key_responsibilities: [],
        experience_required: 0,
        seniority_level: 'mid',
        tech_stack: [],
        soft_skills: []
      };
    }

    return parsed;
  }
};

module.exports = jdAnalyzer;