const StatusService = require('../services/status.service');

// Récupérer tous les statuts
const getAllStatuses = async (req, res) => {
  try {
    const statuses = await StatusService.getAllStatuses();
    res.status(200).json(statuses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Récupérer un statut par ID
const getStatusById = async (req, res) => {
  try {
    const status = await StatusService.getStatusById(req.params.id);
    if (status) {
      res.status(200).json(status);
    } else {
      res.status(404).json({ message: 'Statut non trouvé' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Créer un nouveau statut
const createStatus = async (req, res) => {
  try {
    const status = await StatusService.createStatus(req.body);
    res.status(201).json(status);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Mettre à jour un statut
const updateStatus = async (req, res) => {
  try {
    const updatedStatus = await StatusService.updateStatus(req.params.id, req.body);
    if (updatedStatus) {
      res.status(200).json(updatedStatus);
    } else {
      res.status(404).json({ message: 'Statut non trouvé' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Supprimer un statut
const deleteStatus = async (req, res) => {
  try {
    const deleted = await StatusService.deleteStatus(req.params.id);
    if (deleted) {
      res.status(204).send(); // No Content
    } else {
      res.status(404).json({ message: 'Statut non trouvé' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAllStatuses,
  getStatusById,
  createStatus,
  updateStatus,
  deleteStatus,
};
