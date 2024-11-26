const ProjectStatusService = require('../services/projectStatus.service');

// Get all project-status associations
const getAllProjectStatuses = async (req, res) => {
  try {
    const projectStatuses = await ProjectStatusService.getAllProjectStatuses();
    res.status(200).json(projectStatuses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a project-status association by ID
const getProjectStatusById = async (req, res) => {
  try {
    const projectStatus = await ProjectStatusService.getProjectStatusById(req.params.id);
    if (projectStatus) {
      res.status(200).json(projectStatus);
    } else {
      res.status(404).json({ message: 'Project-Status association not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create a new project-status association
const createProjectStatus = async (req, res) => {
  try {
    // Assurez-vous que req.body contient les données nécessaires
    const { projectId, statusId } = req.body;
    if (!projectId || !statusId) {
      return res.status(400).json({ message: 'Project ID and Status ID are required' });
    }

    const projectStatus = await ProjectStatusService.createProjectStatus(req.body);
    res.status(201).json(projectStatus);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update a project-status association
const updateProjectStatus = async (req, res) => {
  try {
    const updatedProjectStatus = await ProjectStatusService.updateProjectStatus(req.params.id, req.body);
    if (updatedProjectStatus) {
      res.status(200).json(updatedProjectStatus);
    } else {
      res.status(404).json({ message: 'Project-Status association not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete a project-status association
const deleteProjectStatus = async (req, res) => {
  try {
    const deleted = await ProjectStatusService.deleteProjectStatus(req.params.id);
    if (deleted) {
      res.status(204).send(); // No Content
    } else {
      res.status(404).json({ message: 'Project-Status association not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getStatusesByProjectId = async (req, res) => {
  try {
    const statuses = await ProjectStatusService.getStatusesByProjectId(req.params.projectId);
    res.status(200).json(statuses);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération des statuts par ID de projet' });
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
