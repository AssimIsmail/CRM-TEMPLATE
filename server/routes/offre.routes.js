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

// Route pour récupérer le nombre total d'offres
router.get('/total/count', OffreController.getTotalOffresCount);

// Route pour récupérer le nombre d'offres ajoutées chaque jour
router.get('/daily/count', OffreController.getDailyOffresCount);
// Route pour récupérer le nombre d'offres fermées chaque jour
router.get('/daily/closed/count', OffreController.getDailyClosedOffresCount);
// Route pour récupérer le nombre de clients par statut pour chaque mois
router.get('/status/monthly/count', OffreController.getClientsCountByStatusMonthly);
// Route to get the number of offers with a specific status name
router.get('/:statusName/count', OffreController.getOffresCount);






module.exports = router;
