const express = require('express');
const ProjectController = require('../controllers/project.controller');
const router = express.Router();

// Route pour récupérer tous les projets
router.get('/', ProjectController.getAllProjects);

// Route pour récupérer un projet par ID
router.get('/:id', ProjectController.getProjectById);

// Route pour créer un nouveau projet
router.post('/', ProjectController.createProject);

// Route pour mettre à jour un projet
router.put('/:id', ProjectController.updateProject);

// Route pour supprimer un projet
router.delete('/:id', ProjectController.deleteProject);


// Route for creating a project with a status
router.post('/creerProjetAvecStatut', ProjectController.creerProjetAvecStatut);

// Route pour supprimer une relation projet-statut
router.delete('/:idProject/statuts/:idStatut', ProjectController.supprimerRelation);

// Ensure this route is defined
router.get('/statutsParProjet/:id', ProjectController.getStatutsParProjet);

module.exports = router;
