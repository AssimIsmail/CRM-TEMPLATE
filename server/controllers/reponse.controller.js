const ReponseService = require('../services/reponse.service');

// Get all responses
const getAllReponses = async (req, res) => {
  try {
    const reponses = await ReponseService.getAllReponses();
    res.status(200).json(reponses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a response by ID
const getReponseById = async (req, res) => {
  try {
    const reponse = await ReponseService.getReponseById(req.params.id);
    if (reponse) {
      res.status(200).json(reponse);
    } else {
      res.status(404).json({ message: 'Reponse not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get responses by question ID
const getReponsesByQuestionId = async (req, res) => {
  try {
    const reponses = await ReponseService.getReponsesByQuestionId(req.params.questionId);
    if (reponses.length > 0) {
      res.status(200).json(reponses);
    } else {
      res.status(404).json({ message: 'No responses found for this question' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create a new response
const createReponse = async (req, res) => {
  try {
    const reponse = await ReponseService.createReponse(req.body);
    res.status(201).json(reponse);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update a response
const updateReponse = async (req, res) => {
  try {
    const updatedReponse = await ReponseService.updateReponse(req.params.id, req.body);
    if (updatedReponse) {
      res.status(200).json(updatedReponse);
    } else {
      res.status(404).json({ message: 'Reponse not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete a response
const deleteReponse = async (req, res) => {
  try {
    const deleted = await ReponseService.deleteReponse(req.params.id);
    if (deleted) {
      res.status(204).send(); // No Content
    } else {
      res.status(404).json({ message: 'Reponse not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAllReponses,
  getReponseById,
  getReponsesByQuestionId,
  createReponse,
  updateReponse,
  deleteReponse,
};
