const errorHandler = (err, req, res, next) => {
  console.error('Error:', {
    message: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method
  });

  if (err.message && (err.message.includes('Claude API') || err.message.includes('AI Service'))) {
    return res.status(503).json({
      error: 'AI Service temporarily unavailable',
      message: process.env.NODE_ENV === 'development' ? err.message : 'Please try again in a moment',
      ...(process.env.NODE_ENV === 'development' && { details: err.stack })
    });
  }

  if (err.message && err.message.includes('not found')) {
    return res.status(404).json({
      error: 'Resource not found',
      message: err.message
    });
  }

  res.status(err.statusCode || 500).json({
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};

module.exports = errorHandler;