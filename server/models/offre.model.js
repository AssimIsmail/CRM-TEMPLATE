const { DataTypes } = require('sequelize');
const sequelize = require('../config/db.config');  // Ensure the path is correct

const Offre = sequelize.define('Offre', {
  first_name: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  last_name: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  phone: {
    type: DataTypes.STRING(15),
    allowNull: false,
  },
  otherphone: {
    type: DataTypes.STRING(15),
    allowNull: true,
  },
  address: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  commantaire_prospecteur: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  commantaire_vendeur: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  statusId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'statuses',
      key: 'id',
    },
  },
  projectId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'projects',
      key: 'id',
    },
  },
  centreId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'centres',
      key: 'id',
    },
  },
  prospecteurId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'users',
      key: 'id',
    },
  },
  vendeurId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'users',
      key: 'id',
    },
  }
}, {
  tableName: 'offres', // Table name in the database
  timestamps: true, // Adds createdAt and updatedAt columns
  createdAt: 'created_at',
  updatedAt: 'updated_at',
});

// Exporter le modèle
module.exports = Offre;
