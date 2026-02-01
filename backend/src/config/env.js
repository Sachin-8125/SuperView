const requiredEnvVars = ['GEMINI_API_KEY'];

const optionalEnvVars = {
  NODE_ENV: 'development',
  PORT: 5000,
  CORS_ORIGIN: 'http://localhost:3000',
  LOG_LEVEL: 'info',
  DATABASE_URL: null,
  JWT_SECRET: 'dev-secret-key',
  SESSION_TIMEOUT: 3600000,
  MAX_QUESTIONS: 8,
  QUESTION_TIME_LIMIT: 60,
  MIN_PERFORMANCE_THRESHOLD: 30,
  EARLY_TERMINATION_AFTER: 3
};

const validateEnv = () => {
  const missing = requiredEnvVars.filter(v => !process.env[v]);
  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
  }
};

const getConfig = () => {
  validateEnv();
  
  return {
    nodeEnv: process.env.NODE_ENV || optionalEnvVars.NODE_ENV,
    port: parseInt(process.env.PORT) || optionalEnvVars.PORT,
    corsOrigin: process.env.CORS_ORIGIN || optionalEnvVars.CORS_ORIGIN,
    logLevel: process.env.LOG_LEVEL || optionalEnvVars.LOG_LEVEL,
    geminiApiKey: process.env.GEMINI_API_KEY,
    databaseUrl: process.env.DATABASE_URL || optionalEnvVars.DATABASE_URL,
    jwtSecret: process.env.JWT_SECRET || optionalEnvVars.JWT_SECRET,
    sessionTimeout: parseInt(process.env.SESSION_TIMEOUT) || optionalEnvVars.SESSION_TIMEOUT,
    maxQuestions: parseInt(process.env.MAX_QUESTIONS) || optionalEnvVars.MAX_QUESTIONS,
    questionTimeLimit: parseInt(process.env.QUESTION_TIME_LIMIT) || optionalEnvVars.QUESTION_TIME_LIMIT,
    minPerformanceThreshold: parseInt(process.env.MIN_PERFORMANCE_THRESHOLD) || optionalEnvVars.MIN_PERFORMANCE_THRESHOLD,
    earlyTerminationAfter: parseInt(process.env.EARLY_TERMINATION_AFTER) || optionalEnvVars.EARLY_TERMINATION_AFTER,
    isDevelopment: (process.env.NODE_ENV || optionalEnvVars.NODE_ENV) === 'development',
    isProduction: (process.env.NODE_ENV || optionalEnvVars.NODE_ENV) === 'production',
  };
};

module.exports = { validateEnv, getConfig, config: getConfig() };
