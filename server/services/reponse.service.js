const Reponse = require('../models/reponse.model'); // Ensure the path is correct

// Function to get all responses
const getAllReponses = async () => {
  return await Reponse.findAll();
};

// Function to get a response by ID
const getReponseById = async (id) => {
  return await Reponse.findByPk(id);
};

// Function to get responses by question ID
const getReponsesByQuestionId = async (questionId) => {
  return await Reponse.findAll({ where: { questionId } });
};

// Function to create a new response
const createReponse = async (reponseData) => {
  return await Reponse.create(reponseData);
};

// Function to update a response
const updateReponse = async (id, reponseData) => {
  const reponse = await Reponse.findByPk(id);
  if (reponse) {
    return await reponse.update(reponseData);
  }
  return null;
};

// Function to delete a response
const deleteReponse = async (id) => {
  const reponse = await Reponse.findByPk(id);
  if (reponse) {
    await reponse.destroy();
    return true;
  }
  return false;
};

module.exports = {
  getAllReponses,
  getReponseById,
  getReponsesByQuestionId,
  createReponse,
  updateReponse,
  deleteReponse,
};
