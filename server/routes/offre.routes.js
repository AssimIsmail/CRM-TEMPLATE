const express = require('express');
const OffreController = require('../controllers/offre.controller');
const router = express.Router();

// Route pour récupérer toutes les offres
router.get('/', OffreController.getAllOffres);

// Route pour récupérer une offre par ID
router.get('/:id', OffreController.getOffreById);

// Route pour créer une nouvelle offre
router.post('/', OffreController.createOffre);

// Route pour mettre à jour une offre
router.put('/:id', OffreController.updateOffre);

// Route pour supprimer une offre
router.delete('/:id', OffreController.deleteOffre);

module.exports = router;
