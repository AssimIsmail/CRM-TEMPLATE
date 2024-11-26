const Tache = require('../models/tache.model'); // Ensure the path is correct

// Function to get all tasks
const getAllTaches = async () => {
  return await Tache.findAll();
};

// Function to get a task by ID
const getTacheById = async (id) => {
  return await Tache.findByPk(id);
};

// Function to create a new task
const createTache = async (tacheData) => {
  return await Tache.create(tacheData);
};

// Function to update a task
const updateTache = async (id, tacheData) => {
  const tache = await Tache.findByPk(id);
  if (tache) {
    return await tache.update(tacheData);
  }
  return null;
};

// Function to delete a task
const deleteTache = async (id) => {
  const tache = await Tache.findByPk(id);
  if (tache) {
    await tache.destroy();
    return true;
  }
  return false;
};

module.exports = {
  getAllTaches,
  getTacheById,
  createTache,
  updateTache,
  deleteTache,
};
