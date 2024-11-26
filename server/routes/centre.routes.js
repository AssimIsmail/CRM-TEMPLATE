const express = require('express');
const CentreController = require('../controllers/centre.controller');
const multer = require('multer');
const upload = multer({ dest: 'storage/images' });  // Utilisation de Multer pour l'upload d'images

const router = express.Router();

// Routes pour les centres
router.get('/', CentreController.getAllCentres);
router.get('/:id', CentreController.getCentreById);
router.post('/', upload.single('logo'), CentreController.createCentre);  // Utilisation de Multer pour gérer l'upload
router.put('/:id', upload.single('logo'), CentreController.updateCentre);  // Utilisation de Multer pour gérer l'upload
router.delete('/:id', CentreController.deleteCentre);

module.exports = router;
