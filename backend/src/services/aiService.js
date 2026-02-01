const Anthropic = require('@anthropic-ai/sdk');
const { config } = require('../config/env');

const client = new Anthropic({ apiKey: config.anthropicKey });

const aiService = {
  async callClaude(prompt, maxTokens = 1024) {
    try {
      const message = await client.messages.create({
        model: 'claude-opus-4-5-20251101',
        max_tokens: maxTokens,
        messages: [{
          role: 'user',
          content: prompt
        }]
      });
      return message.content[0].text;
    } catch (error) {
      console.error('Claude API Error:', error);
      throw new Error('Failed to call Claude API: ' + error.message);
    }
  },

  async parseJSON(response) {
    try {
      return JSON.parse(response);
    } catch (error) {
      console.error('JSON Parse Error:', error);
      return null;
    }
  }
};

module.exports = aiService;