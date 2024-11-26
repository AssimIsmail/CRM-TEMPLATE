const Centre = require('../models/centre.model');

const getAllCentres = async () => {
  return await Centre.findAll();
};

const getCentreById = async (id) => {
  return await Centre.findByPk(id);
};

const createCentre = async (centreData) => {
  try {
    const centre = await Centre.create(centreData); 
    return centre;
  } catch (error) {
    console.error(error);
    throw new Error('Erreur lors de la création du centre');
  }
};
const updateCentre = async (id, centreData) => {
  const centre = await Centre.findByPk(id);
  if (centre) {
    return await centre.update(centreData);
  }
  return null;
};

const deleteCentre = async (id) => {
  const centre = await Centre.findByPk(id);
  if (centre) {
    await centre.destroy();
    return true;
  }
  return false;
};

module.exports = {
  getAllCentres,
  getCentreById,
  createCentre,
  updateCentre,
  deleteCentre,
};
