const Question = require('../models/question.model'); // Ensure the path is correct

// Function to get all questions
const getAllQuestions = async () => {
  return await Question.findAll();
};

// Function to get a question by ID
const getQuestionById = async (id) => {
  return await Question.findByPk(id);
};

// Function to create a new question
const createQuestion = async (questionData) => {
  return await Question.create(questionData);
};

// Function to update a question
const updateQuestion = async (id, questionData) => {
  const question = await Question.findByPk(id);
  if (question) {
    return await question.update(questionData);
  }
  return null;
};

// Function to delete a question
const deleteQuestion = async (id) => {
  const question = await Question.findByPk(id);
  if (question) {
    await question.destroy();
    return true;
  }
  return false;
};

module.exports = {
  getAllQuestions,
  getQuestionById,
  createQuestion,
  updateQuestion,
  deleteQuestion,
};
