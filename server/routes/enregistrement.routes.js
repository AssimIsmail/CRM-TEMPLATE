const express = require('express');
const EnregistrementController = require('../controllers/enregistrement.controller');
const router = express.Router();

// Route to get all enregistrements
router.get('/', EnregistrementController.getAllEnregistrements);

// Route to get an enregistrement by ID
router.get('/:id', EnregistrementController.getEnregistrementById);

// Route to create a new enregistrement
router.post('/', EnregistrementController.createEnregistrement);

// Route to update an enregistrement
router.put('/:id', EnregistrementController.updateEnregistrement);

// Route to delete an enregistrement
router.delete('/:id', EnregistrementController.deleteEnregistrement);

module.exports = router;
