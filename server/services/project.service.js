const Project = require('../models/project.model'); // Assurez-vous que le chemin est correct
const ProjectStatus = require('../models/project_status.model'); // Ensure this model is defined correctly
const Status = require('../models/status.model'); // Ensure this model is defined correctly

// Fonction pour récupérer tous les projets
const getAllProjects = async () => {
  return await Project.findAll();
};

// Fonction pour récupérer un projet par ID
const getProjectById = async (id) => {
  return await Project.findByPk(id);
};

// Fonction pour créer un nouveau projet
const createProject = async (projectData) => {
  return await Project.create(projectData);
};

// Fonction pour mettre à jour un projet
const updateProject = async (id, projectData) => {
  const project = await Project.findByPk(id);
  if (project) {
    return await project.update(projectData);
  }
  return null;
};

// Fonction pour supprimer un projet
const deleteProject = async (id) => {
  const project = await Project.findByPk(id);
  if (project) {
    await project.destroy();
    return true;
  }
  return false;
};

// Fonction pour créer un projet avec un statut
const creerProjetAvecStatut = async (idProject, idStatut) => {
  try {
    const project = await Project.findByPk(idProject);
    if (!project) {
      throw new Error('Projet non trouvé');
    }

    const statut = await Status.findByPk(idStatut);
    if (!statut) {
      throw new Error('Statut non trouvé');
    }

    await project.addStatut(statut);

    return project;
  } catch (error) {
    console.error('Erreur lors de la création du projet avec statut:', error);
    throw error;
  }
};

const getStatutsParProjet = async (idProject) => {
  const project = await Project.findByPk(idProject, {
    include: [{ model: Status, as: 'Statuts' }],
  });
  if (!project) {
    throw new Error('Projet non trouvé');
  }
  return project.Statuts || [];
};


// Fonction pour supprimer une relation projet-statut
const supprimerRelation = async (idProject, idStatut) => {
  try {
    const result = await ProjectStatus.destroy({
      where: { projectId: idProject, statusId: idStatut }
    });
    return result > 0;
  } catch (error) {
    console.error('Error deleting project-status relation:', error);
    return false;
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
