const ProjectStatus = require('../models/project_status.model'); // Ensure the path is correct
const Status = require('../models/status.model'); // Ensure the path is correct
const Project = require('../models/project.model'); // Ensure the path is correct

// Function to get all project-status associations
const getAllProjectStatuses = async () => {
  return await ProjectStatus.findAll();
};

// Function to get a project-status association by ID
const getProjectStatusById = async (id) => {
  return await ProjectStatus.findByPk(id);
};

// Function to create a new project-status association
const createProjectStatus = async (projectStatusData) => {
  return await ProjectStatus.create(projectStatusData);
};

// Function to update a project-status association
const updateProjectStatus = async (id, projectStatusData) => {
  const projectStatus = await ProjectStatus.findByPk(id);
  if (projectStatus) {
    return await projectStatus.update(projectStatusData);
  }
  return null;
};

// Function to delete a project-status association
const deleteProjectStatus = async (id) => {
  const projectStatus = await ProjectStatus.findByPk(id);
  if (projectStatus) {
    await projectStatus.destroy();
    return true;
  }
  return false;
};

// Function to get statuses by project ID
const getStatusesByProjectId = async (projectId) => {
  try {
    const project = await Project.findOne({
      where: { id: projectId },
      include: [{ model: Status, as: 'statuses' }] // Assurez-vous que l'association est correctement définie dans votre modèle
    });
    return project ? project.statuses : [];
  } catch (error) {
    throw new Error('Erreur lors de la récupération des statuts par ID de projet');
  }
};

module.exports = {
  getAllProjectStatuses,
  getProjectStatusById,
  createProjectStatus,
  updateProjectStatus,
  deleteProjectStatus,
  getStatusesByProjectId,
};
