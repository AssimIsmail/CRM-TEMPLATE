const express = require('express');
const ReponseController = require('../controllers/reponse.controller');
const router = express.Router();

// Route to get all responses
router.get('/', ReponseController.getAllReponses);

// Route to get a response by ID
router.get('/:id', ReponseController.getReponseById);

// Route to get responses by question ID
router.get('/question/:questionId', ReponseController.getReponsesByQuestionId);

// Route to create a new response
router.post('/', ReponseController.createReponse);

// Route to update a response
router.put('/:id', ReponseController.updateReponse);

// Route to delete a response
router.delete('/:id', ReponseController.deleteReponse);

module.exports = router;
