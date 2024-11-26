const TacheService = require('../services/tache.service');

// Get all tasks
const getAllTaches = async (req, res) => {
  try {
    const taches = await TacheService.getAllTaches();
    res.status(200).json(taches);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a task by ID
const getTacheById = async (req, res) => {
  try {
    const tache = await TacheService.getTacheById(req.params.id);
    if (tache) {
      res.status(200).json(tache);
    } else {
      res.status(404).json({ message: 'Task not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create a new task
const createTache = async (req, res) => {
  try {
    const tache = await TacheService.createTache(req.body);
    res.status(201).json(tache);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update a task
const updateTache = async (req, res) => {
  try {
    const updatedTache = await TacheService.updateTache(req.params.id, req.body);
    if (updatedTache) {
      res.status(200).json(updatedTache);
    } else {
      res.status(404).json({ message: 'Task not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete a task
const deleteTache = async (req, res) => {
  try {
    const deleted = await TacheService.deleteTache(req.params.id);
    if (deleted) {
      res.status(204).send(); // No Content
    } else {
      res.status(404).json({ message: 'Task not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAllTaches,
  getTacheById,
  createTache,
  updateTache,
  deleteTache,
};
