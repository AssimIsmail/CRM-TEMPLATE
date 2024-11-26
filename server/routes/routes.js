const express = require('express');
const authenticateToken = require('../middleware/auth');
const centreRoutes = require('./centre.routes'); 
const statusRoutes = require('./status.routes'); 
const userRoutes = require('./user.routes'); 
const projectRoutes = require('./project.routes'); 
const offreRoutes = require('./offre.routes'); 
const questionRoutes = require('./question.routes'); 
const reponseRoutes = require('./reponse.routes'); 
const enregistrementRoutes = require('./enregistrement.routes'); 
const eventRoutes = require('./event.routes'); 
const documentRoutes = require('./document.routes'); 
const noteRoutes = require('./note.routes'); 
const tacheRoutes = require('./tache.routes'); 
const projectStatusRoutes = require('./projectStatus.routes'); 
const router = express.Router();

//router.use(authenticateToken);

router.use('/centres', centreRoutes);
router.use('/statuses', statusRoutes);
router.use('/users', userRoutes); 
router.use('/projects', projectRoutes); 
router.use('/offres', offreRoutes); 
router.use('/questions', questionRoutes); 
router.use('/reponses', reponseRoutes); 
router.use('/enregistrements', enregistrementRoutes); 
router.use('/events', eventRoutes); 
router.use('/documents', documentRoutes); 
router.use('/notes', noteRoutes); 
router.use('/taches', tacheRoutes); 
router.use('/project-status', projectStatusRoutes); 

module.exports = router;
