const Joi = require('joi');

const schemas = {
  startInterview: Joi.object({
    resume: Joi.string().required().min(10),
    jobDescription: Joi.string().required().min(10)
  }),

  submitAnswer: Joi.object({
    sessionId: Joi.string().uuid().required(),
    answer: Joi.string().required().min(5),
    timeSpent: Joi.number().integer().min(0).required()
  })
};

const validateStartInterview = (req, res, next) => {
  const { error, value } = schemas.startInterview.validate(req.body);
  
  if (error) {
    return res.status(400).json({
      error: 'Validation failed',
      details: error.details.map(d => ({
        field: d.path.join('.'),
        message: d.message
      }))
    });
  }

  req.body = value;
  next();
};

const validateSubmitAnswer = (req, res, next) => {
  const { error, value } = schemas.submitAnswer.validate(req.body);
  
  if (error) {
    return res.status(400).json({
      error: 'Validation failed',
      details: error.details.map(d => ({
        field: d.path.join('.'),
        message: d.message
      }))
    });
  }

  req.body = value;
  next();
};

module.exports = {
  validateStartInterview,
  validateSubmitAnswer
};