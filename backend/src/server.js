const express = require('express');
const cors = require('cors');
require('dotenv').config();

const interviewRoutes = require('./routes/interviewRoutes');
const resultRoutes = require('./routes/resultRoutes');
const errorHandler = require('./middleware/errorHandler');

const app = express();

// Middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));
// CORS configuration - support multiple origins for development
const corsOrigins = process.env.CORS_ORIGINS?.split(',') || [
  'http://localhost:3000',
  'http://localhost:3001'
];

app.use(cors({
  origin: function(origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    if (corsOrigins.includes(origin)) {
      return callback(null, true);
    }
    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true
}));

// Logger middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Routes
app.use('/api/interview', interviewRoutes);
app.use('/api/results', resultRoutes);

// 404 Handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Error Handler
app.use(errorHandler);

// Server Start
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════════╗
║   Interview Platform Backend Started       ║
║   Port: ${PORT}                              ║
║   Environment: ${process.env.NODE_ENV}            ║
╚════════════════════════════════════════════╝
  `);
});

// Graceful Shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received. Shutting down gracefully...');
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});

module.exports = app;