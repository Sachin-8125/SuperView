const aiService = require('./aiService');

const resumeParser = {
  async parse(resumeText) {
    if (!resumeText || resumeText.trim().length === 0) {
      throw new Error('Resume text is required');
    }

    const prompt = `Extract and structure this resume data in JSON format.
Extract: 
- skills (array of technical and soft skills)
- experience (array with role, company, duration, achievements)
- projects (array with name and description)
- relevance_keywords (array of important keywords)
- education (degree, institution, year)
- summary (2-3 line professional summary)

Resume:
${resumeText}

Return ONLY valid JSON without markdown. If any field is missing, use empty array or null.`;

    const response = await aiService.callClaude(prompt, 1024);
    const parsed = await aiService.parseJSON(response);

    if (!parsed) {
      return {
        skills: [],
        experience: [],
        projects: [],
        relevance_keywords: [],
        education: null,
        summary: ''
      };
    }

    return parsed;
  }
};

module.exports = resumeParser;