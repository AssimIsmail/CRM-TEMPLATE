const express = require('express');
const TacheController = require('../controllers/tache.controller');
const router = express.Router();

// Route to get all tasks
router.get('/', TacheController.getAllTaches);

// Route to get a task by ID
router.get('/:id', TacheController.getTacheById);

// Route to create a new task
router.post('/', TacheController.createTache);

// Route to update a task
router.put('/:id', TacheController.updateTache);

// Route to delete a task
router.delete('/:id', TacheController.deleteTache);

module.exports = router;
