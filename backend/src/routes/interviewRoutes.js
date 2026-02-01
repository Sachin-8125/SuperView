const express = require('express');
const router = express.Router();
const interviewController = require('../controllers/interviewController');
const { validateStartInterview, validateSubmitAnswer } = require('../middleware/validation');

router.post('/start', validateStartInterview, interviewController.startInterview);
router.post('/answer', validateSubmitAnswer, interviewController.submitAnswer);

module.exports = router;
