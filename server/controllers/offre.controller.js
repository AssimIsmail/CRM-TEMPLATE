const OffreService = require('../services/offre.service');

// Récupérer toutes les offres
const getAllOffres = async (req, res) => {
  try {
    const offres = await OffreService.getAllOffres();
    res.status(200).json(offres);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Récupérer une offre par ID
const getOffreById = async (req, res) => {
  try {
    const offre = await OffreService.getOffreById(req.params.id);
    if (offre) {
      res.status(200).json(offre);
    } else {
      res.status(404).json({ message: 'Offre non trouvée' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Créer une nouvelle offre
const createOffre = async (req, res) => {
  try {
    const offre = await OffreService.createOffre(req.body);
    res.status(201).json(offre);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Mettre à jour une offre
const updateOffre = async (req, res) => {
  try {
    const updatedOffre = await OffreService.updateOffre(req.params.id, req.body);
    if (updatedOffre) {
      res.status(200).json(updatedOffre);
    } else {
      res.status(404).json({ message: 'Offre non trouvée' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Supprimer une offre
const deleteOffre = async (req, res) => {
  try {
    const deleted = await OffreService.deleteOffre(req.params.id);
    if (deleted) {
      res.status(204).send(); // No Content
    } else {
      res.status(404).json({ message: 'Offre non trouvée' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAllOffres,
  getOffreById,
  createOffre,
  updateOffre,
  deleteOffre,
};
