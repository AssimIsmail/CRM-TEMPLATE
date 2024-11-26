const express = require('express');
const ProjectStatusController = require('../controllers/projectStatus.controller');
const router = express.Router();

// Route to get all project-status associations
router.get('/', ProjectStatusController.getAllProjectStatuses);

// Route to get a project-status association by ID
router.get('/:id', ProjectStatusController.getProjectStatusById);

// Route to create a new project-status association
router.post('/', ProjectStatusController.createProjectStatus);

// Route to update a project-status association
router.put('/:id', ProjectStatusController.updateProjectStatus);

// Route to delete a project-status association
router.delete('/:id', ProjectStatusController.deleteProjectStatus);

// Route pour obtenir les statuts par ID de projet
router.get('/statutsParProjet/:projectId', ProjectStatusController.getStatusesByProjectId);

module.exports = router;
