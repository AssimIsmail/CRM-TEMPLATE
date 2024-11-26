const Offre = require('../models/offre.model'); // Assurez-vous que le chemin est correct

// Fonction pour récupérer toutes les offres
const getAllOffres = async () => {
  return await Offre.findAll();
};

// Fonction pour récupérer une offre par ID
const getOffreById = async (id) => {
  return await Offre.findByPk(id);
};

// Fonction pour créer une nouvelle offre
const createOffre = async (offreData) => {
  return await Offre.create(offreData);
};

// Fonction pour mettre à jour une offre
const updateOffre = async (id, offreData) => {
  const offre = await Offre.findByPk(id);
  if (offre) {
    return await offre.update(offreData);
  }
  return null;
};

// Fonction pour supprimer une offre
const deleteOffre = async (id) => {
  const offre = await Offre.findByPk(id);
  if (offre) {
    await offre.destroy();
    return true;
  }
  return false;
};

module.exports = {
  getAllOffres,
  getOffreById,
  createOffre,
  updateOffre,
  deleteOffre,
};
