const Status = require('../models/status.model'); // Assurez-vous que le chemin est correct

// Fonction pour récupérer tous les statuts
const getAllStatuses = async () => {
  return await Status.findAll();
};

// Fonction pour récupérer un statut par ID
const getStatusById = async (id) => {
  return await Status.findByPk(id);
};

// Fonction pour créer un nouveau statut
const createStatus = async (statusData) => {
  return await Status.create(statusData);
};

// Fonction pour mettre à jour un statut
const updateStatus = async (id, statusData) => {
  const status = await Status.findByPk(id);
  if (status) {
    return await status.update(statusData);
  }
  return null;
};

// Fonction pour supprimer un statut
const deleteStatus = async (id) => {
  const status = await Status.findByPk(id);
  if (status) {
    await status.destroy();
    return true;
  }
  return false;
};

module.exports = {
  getAllStatuses,
  getStatusById,
  createStatus,
  updateStatus,
  deleteStatus,
};
