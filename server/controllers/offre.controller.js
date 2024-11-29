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

// Récupérer le nombre total d'offres
const getTotalOffresCount = async (req, res) => {
  try {
    const count = await OffreService.getTotalOffresCount();
    res.status(200).json({ total: count });
  } catch (error) {
    res.status(500).json({ message: 'aucun' });
  }
};

// Get the number of offers with a specific status name
const getOffresCount = async (req, res) => {
  try {
    const statusName = req.params.statusName; // Get status name from URL
    const count = await OffreService.getOffresCount(statusName);
    res.status(200).json({ total: count });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Récupérer le nombre d'offres ajoutées chaque jour
const getDailyOffresCount = async (req, res) => {
  try {
    const dailyCount = await OffreService.getDailyOffresCount();
    res.status(200).json(dailyCount);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Récupérer le nombre d'offres fermées chaque jour
const getDailyClosedOffresCount = async (req, res) => {
  try {
    const dailyClosedCount = await OffreService.getDailyClosedOffresCount();
    res.status(200).json(dailyClosedCount);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getClientsCountByStatusMonthly = async (req, res) => {
  try {
    const data = await OffreService.getClientsCountByStatusMonthly();
    res.status(200).json(data);
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
  getTotalOffresCount,
  getOffresCount,
  getDailyOffresCount,
  getDailyClosedOffresCount,
  getClientsCountByStatusMonthly,
};
