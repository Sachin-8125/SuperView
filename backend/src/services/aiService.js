const { GoogleGenerativeAI } = require('@google/generative-ai');
const { config } = require('../config/env');

const genAI = new GoogleGenerativeAI(config.geminiApiKey);

const aiService = {
  async callClaude(prompt, maxTokens = 1024) {
    try {
      // Use Gemini 1.5 Pro for best results
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-pro' });
      
      const result = await model.generateContent(prompt);
      const response = result.response;
      const text = response.text();
      
      return text;
    } catch (error) {
      console.error('Gemini API Error:', error);
      throw new Error('Failed to call Gemini API: ' + error.message);
    }
  },

  async parseJSON(response) {
    try {
      // Try to extract JSON from the response if it's wrapped in markdown
      const jsonMatch = response.match(/```json\n([\s\S]*?)\n```/) || response.match(/\{[\s\S]*\}/);
      const jsonStr = jsonMatch ? (jsonMatch[1] || jsonMatch[0]) : response;
      return JSON.parse(jsonStr);
    } catch (error) {
      console.error('JSON Parse Error:', error);
      return null;
    }
  }
};

module.exports = aiService;
