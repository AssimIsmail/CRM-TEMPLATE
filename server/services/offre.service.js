// Adjust the import to include Status
const Offre = require('../models/offre.model'); // Adjust the import to include Status
const  Status  = require('../models/status.model'); // Adjust the import to include Status
const sequelize = require('sequelize');

// Fonction pour récupérer toutes les offres
const getAllOffres = async () => {
  return await Offre.findAll();
};

// Fonction pour récupérer une offre par ID
const getOffreById = async (id) => {
  return await Offre.findByPk(id);
};

// Fonction pour créer une nouvelle offre
const createOffre = async (offreData) => {
  return await Offre.create(offreData);
};

// Fonction pour mettre à jour une offre
const updateOffre = async (id, offreData) => {
  const offre = await Offre.findByPk(id);
  if (offre) {
    return await offre.update(offreData);
  }
  return null;
};

// Fonction pour supprimer une offre
const deleteOffre = async (id) => {
  const offre = await Offre.findByPk(id);
  if (offre) {
    await offre.destroy();
    return true;
  }
  return false;
};

// Fonction pour récupérer le nombre total d'offres
const getTotalOffresCount = async () => {
  return await Offre.count();
};

// Function to get the number of offers with a specific status name
const getOffresCount = async (statusName) => {
  return await Offre.count({
    include: [{
      model: Status,
      as: 'statusAlias',
      where: { name: statusName }
    }]
  });
};

// Fonction pour récupérer le nombre d'offres ajoutées chaque jour pour la dernière semaine
const getDailyOffresCount = async () => {
  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

  return await Offre.findAll({
    attributes: [
      [sequelize.fn('DATE', sequelize.col('created_at')), 'date'],
      [sequelize.fn('COUNT', sequelize.col('id')), 'count']
    ],
    where: {
      created_at: {
        [sequelize.Op.gte]: oneWeekAgo
      }
    },
    group: ['date'],
    order: [['date', 'ASC']]
  });
};

// Fonction pour récupérer le nombre d'offres fermées chaque jour pour la dernière semaine
const getDailyClosedOffresCount = async () => {
  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

  const results = await Offre.findAll({
    attributes: [
      [sequelize.fn('DATE', sequelize.col('Offre.created_at')), 'date'],
      [sequelize.fn('COUNT', sequelize.col('Offre.id')), 'count']
    ],
    include: [{
      model: Status,
      as: 'statusAlias',
      where: { name: 'close' }
    }],
    where: {
      created_at: {
        [sequelize.Op.gte]: oneWeekAgo
      }
    },
    group: ['date'],
    order: [['date', 'ASC']],
    raw: true,
  });

  return results.map(result => ({
    date: result.date,
    count: result.count
  }));
};

const getClientsCountByStatusMonthly = async () => {
  const rawData = await Offre.findAll({
    attributes: [
      [sequelize.fn('DATE_FORMAT', sequelize.col('Offre.created_at'), '%Y-%m'), 'month'],
      [sequelize.col('statusAlias.name'), 'status'],
      [sequelize.col('statusAlias.color'), 'color'],
      [sequelize.fn('COUNT', sequelize.col('Offre.id')), 'count']
    ],
    include: [{
      model: Status,
      as: 'statusAlias'
    }],
    group: ['month', 'status', 'color'],
    order: [['month', 'ASC']],
    raw: true,
  });

  // Transform the raw data into the desired format
  const transformedData = {};
  rawData.forEach(item => {
    if (!transformedData[item.status]) {
      transformedData[item.status] = {
        color: item.color,
        data: Array(12).fill(0)
      };
    }
    const monthIndex = new Date(item.month + '-01').getMonth();
    transformedData[item.status].data[monthIndex] = item.count;
  });

  return Object.keys(transformedData).map(status => ({
    name: status,
    data: transformedData[status].data,
    color: transformedData[status].color
  }));
};

module.exports = {
  getAllOffres,
  getOffreById,
  createOffre,
  updateOffre,
  deleteOffre,
  getTotalOffresCount,
  getOffresCount,
  getDailyOffresCount,
  getDailyClosedOffresCount,
  getClientsCountByStatusMonthly,
};
