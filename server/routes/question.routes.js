const express = require('express');
const QuestionController = require('../controllers/question.controller');
const router = express.Router();

// Route to get all questions
router.get('/', QuestionController.getAllQuestions);

// Route to get a question by ID
router.get('/:id', QuestionController.getQuestionById);

// Route to create a new question
router.post('/', QuestionController.createQuestion);

// Route to update a question
router.put('/:id', QuestionController.updateQuestion);

// Route to delete a question
router.delete('/:id', QuestionController.deleteQuestion);

module.exports = router;
