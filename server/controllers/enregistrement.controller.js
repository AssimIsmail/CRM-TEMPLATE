const EnregistrementService = require('../services/enregistrement.service');

// Get all enregistrements
const getAllEnregistrements = async (req, res) => {
  try {
    const enregistrements = await EnregistrementService.getAllEnregistrements();
    res.status(200).json(enregistrements);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get an enregistrement by ID
const getEnregistrementById = async (req, res) => {
  try {
    const enregistrement = await EnregistrementService.getEnregistrementById(req.params.id);
    if (enregistrement) {
      res.status(200).json(enregistrement);
    } else {
      res.status(404).json({ message: 'Enregistrement not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create a new enregistrement
const createEnregistrement = async (req, res) => {
  try {
    const enregistrement = await EnregistrementService.createEnregistrement(req.body);
    res.status(201).json(enregistrement);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update an enregistrement
const updateEnregistrement = async (req, res) => {
  try {
    const updatedEnregistrement = await EnregistrementService.updateEnregistrement(req.params.id, req.body);
    if (updatedEnregistrement) {
      res.status(200).json(updatedEnregistrement);
    } else {
      res.status(404).json({ message: 'Enregistrement not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete an enregistrement
const deleteEnregistrement = async (req, res) => {
  try {
    const deleted = await EnregistrementService.deleteEnregistrement(req.params.id);
    if (deleted) {
      res.status(204).send(); // No Content
    } else {
      res.status(404).json({ message: 'Enregistrement not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAllEnregistrements,
  getEnregistrementById,
  createEnregistrement,
  updateEnregistrement,
  deleteEnregistrement,
};
