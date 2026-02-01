class InMemoryDatabase {
  constructor() {
    this.interviewSessions = {};
    this.userAnswers = {};
  }

  saveSession(sessionId, sessionData) {
    this.interviewSessions[sessionId] = {
      ...sessionData,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    return this.interviewSessions[sessionId];
  }

  getSession(sessionId) {
    return this.interviewSessions[sessionId];
  }

  updateSession(sessionId, updates) {
    if (!this.interviewSessions[sessionId]) {
      throw new Error('Session not found');
    }
    this.interviewSessions[sessionId] = {
      ...this.interviewSessions[sessionId],
      ...updates,
      updatedAt: new Date()
    };
    return this.interviewSessions[sessionId];
  }

  saveAnswer(sessionId, answer) {
    if (!this.userAnswers[sessionId]) {
      this.userAnswers[sessionId] = [];
    }
    this.userAnswers[sessionId].push({
      ...answer,
      createdAt: new Date()
    });
    return answer;
  }

  getAnswers(sessionId) {
    return this.userAnswers[sessionId] || [];
  }

  deleteSession(sessionId) {
    delete this.interviewSessions[sessionId];
    delete this.userAnswers[sessionId];
  }

  clearOldSessions(maxAge = 86400000) {
    const now = Date.now();
    Object.keys(this.interviewSessions).forEach(sessionId => {
      const session = this.interviewSessions[sessionId];
      if (now - new Date(session.createdAt).getTime() > maxAge) {
        this.deleteSession(sessionId);
      }
    });
  }
}

module.exports = {
  InMemoryDatabase,
  db: new InMemoryDatabase()
};