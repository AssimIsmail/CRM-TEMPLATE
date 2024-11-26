const Enregistrement = require('../models/enregistrement.model'); // Ensure the path is correct

// Function to get all enregistrements
const getAllEnregistrements = async () => {
  return await Enregistrement.findAll();
};

// Function to get an enregistrement by ID
const getEnregistrementById = async (id) => {
  return await Enregistrement.findByPk(id);
};

// Function to create a new enregistrement
const createEnregistrement = async (enregistrementData) => {
  return await Enregistrement.create(enregistrementData);
};

// Function to update an enregistrement
const updateEnregistrement = async (id, enregistrementData) => {
  const enregistrement = await Enregistrement.findByPk(id);
  if (enregistrement) {
    return await enregistrement.update(enregistrementData);
  }
  return null;
};

// Function to delete an enregistrement
const deleteEnregistrement = async (id) => {
  const enregistrement = await Enregistrement.findByPk(id);
  if (enregistrement) {
    await enregistrement.destroy();
    return true;
  }
  return false;
};

module.exports = {
  getAllEnregistrements,
  getEnregistrementById,
  createEnregistrement,
  updateEnregistrement,
  deleteEnregistrement,
};
