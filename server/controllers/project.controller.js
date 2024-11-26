const ProjectService = require('../services/project.service');
const Project = require('../models/project.model');
const Status = require('../models/status.model');

// Récupérer tous les projets
const getAllProjects = async (req, res) => {
  try {
    const projects = await ProjectService.getAllProjects();
    res.status(200).json(projects);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Récupérer un projet par ID
const getProjectById = async (req, res) => {
  try {
    const project = await ProjectService.getProjectById(req.params.id);
    if (project) {
      res.status(200).json(project);
    } else {
      res.status(404).json({ message: 'Projet non trouvé' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Créer un nouveau projet
const createProject = async (req, res) => {
  try {
    const project = await ProjectService.createProject(req.body);
    res.status(201).json(project);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Mettre à jour un projet
const updateProject = async (req, res) => {
  try {
    const updatedProject = await ProjectService.updateProject(req.params.id, req.body);
    if (updatedProject) {
      res.status(200).json(updatedProject);
    } else {
      res.status(404).json({ message: 'Projet non trouvé' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Supprimer un projet
const deleteProject = async (req, res) => {
  try {
    const deleted = await ProjectService.deleteProject(req.params.id);
    if (deleted) {
      res.status(204).send(); // No Content
    } else {
      res.status(404).json({ message: 'Projet non trouvé' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Créer un projet avec un statut
const creerProjetAvecStatut = async (req, res) => {
  try {
    const { idProject, idStatut } = req.body;
    const project = await ProjectService.creerProjetAvecStatut(idProject, idStatut);
    res.status(201).json(project);
  } catch (error) {
    console.error('Erreur lors de la création du projet avec statut:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

const getStatutsParProjet = async (req, res) => {
  try {
    const { id } = req.params;
    const project = await Project.findByPk(id, {
      include: [{ model: Status, as: 'Statuts' }],
    });

    if (!project) {
      return res.status(404).json({ message: 'Projet non trouvé' });
    }

    return res.json(project.Statuts);
  } catch (error) {
    console.error('Erreur lors de la récupération des statuts:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};


// Supprimer une relation projet-statut
const supprimerRelation = async (req, res) => {
  try {
    const deleted = await ProjectService.supprimerRelation(req.params.idProject, req.params.idStatut);
    if (deleted) {
      res.status(204).send(); // No Content
    } else {
      res.status(404).json({ message: 'Relation non trouvée' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAllProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
  creerProjetAvecStatut,
  getStatutsParProjet,
  supprimerRelation,
};
